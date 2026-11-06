#!/usr/bin/env python3
"""Baixa as mídias do Google Drive (links públicos), otimiza para web e grava em public/assets/.
Roda no build da Vercel (ver build.sh). Falhas individuais não derrubam o build."""
import json, os, re, subprocess, sys, shutil, urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MAN = json.loads((ROOT / "scripts" / "media_manifest.json").read_text())
# cache entre builds (a Vercel preserva node_modules entre deploys)
CACHE = ROOT / "node_modules" / ".cache" / "dferraro"
RAW = CACHE / "raw"; RAW.mkdir(parents=True, exist_ok=True)
OUTCACHE = CACHE / "out"; OUTCACHE.mkdir(parents=True, exist_ok=True)
MAN_SIG = str(abs(hash(json.dumps(MAN, sort_keys=True))))
ASSETS = ROOT / "public" / "assets"
IMG = ASSETS / "img"; IMG.mkdir(parents=True, exist_ok=True)
VID = ASSETS / "video"; VID.mkdir(parents=True, exist_ok=True)
TH = ASSETS / "thumbs"; TH.mkdir(parents=True, exist_ok=True)
BRAND = ASSETS / "brand"; BRAND.mkdir(parents=True, exist_ok=True)
report = []

try:
    import imageio_ffmpeg
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FFMPEG = shutil.which("ffmpeg")

def drive_download(file_id, dest):
    if dest.exists() and dest.stat().st_size > 1000:
        return True
    errs = []
    try:
        import gdown
        gdown.download(id=file_id, output=str(dest), quiet=True)
        if dest.exists() and dest.stat().st_size > 1000:
            return True
    except Exception as e:
        errs.append(f"gdown: {e}")
    try:
        url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as f:
            shutil.copyfileobj(r, f)
        if dest.exists() and dest.stat().st_size > 1000:
            return True
        errs.append("direto: arquivo vazio")
    except Exception as e:
        errs.append(f"direto: {e}")
    report.append(f"FALHA download {file_id}: {' | '.join(errs)}")
    return False

def url_download(url, dest):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (media-fetch)"})
        with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
            shutil.copyfileobj(r, f)
        return dest.stat().st_size > 500
    except Exception as e:
        report.append(f"FALHA url {url}: {e}")
        return False

def cached(kind, name, outputs, produce):
    """outputs: lista de Paths finais; produce(): gera os arquivos. Reaproveita do cache quando possível."""
    cdir = OUTCACHE / kind / name
    if cdir.exists() and all((cdir / o.name).exists() for o in outputs):
        for o in outputs:
            shutil.copy2(cdir / o.name, o)
        report.append(f"cache {kind} {name}")
        return True
    produce()
    cdir.mkdir(parents=True, exist_ok=True)
    for o in outputs:
        if o.exists():
            shutil.copy2(o, cdir / o.name)
    return False

def save_image(src, name):
    outs = [IMG / f"{name}.webp", IMG / f"{name}-m.webp", TH / f"{name}.jpg"]
    if cached("img", name, outs, lambda: _save_image(src, name)):
        return

def _save_image(src, name):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
    w, h = im.size
    for suffix, maxw in (("", 1800), ("-m", 960)):
        c = im.copy()
        if c.width > maxw:
            c = c.resize((maxw, round(h * maxw / w)), Image.LANCZOS)
        c.convert("RGB").save(IMG / f"{name}{suffix}.webp", "WEBP", quality=80, method=6)
    t = im.copy(); t.thumbnail((360, 360), Image.LANCZOS)
    t.convert("RGB").save(TH / f"{name}.jpg", "JPEG", quality=70)
    report.append(f"ok imagem {name} {w}x{h}")

def duration_of(path):
    p = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", p.stderr)
    return (int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])) if m else 6.0

def save_video(src, name):
    outs = [VID / f"{name}.mp4", VID / f"{name}.jpg"] + [TH / f"{name}-{i}.jpg" for i in (1, 2, 3, 4)]
    if name in MAN.get("mobile", []):
        outs.append(VID / f"{name}-m.mp4")
    if cached("video", name, outs, lambda: _save_video(src, name)):
        return

def _save_video(src, name):
    if not FFMPEG:
        report.append(f"FALHA video {name}: ffmpeg indisponível"); return
    out = VID / f"{name}.mp4"
    cmd = [FFMPEG, "-y", "-i", str(src), "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264", "-crf", "28",
           "-preset", "medium", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True, capture_output=True)
    dur = duration_of(out)
    if name in MAN.get("mobile", []):
        subprocess.run([FFMPEG, "-y", "-i", str(src), "-vf", "scale='min(720,iw)':-2", "-c:v", "libx264", "-crf", "31",
                        "-preset", "medium", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", str(VID / f"{name}-m.mp4")], check=True, capture_output=True)
    subprocess.run([FFMPEG, "-y", "-ss", f"{min(1.0, dur/3):.2f}", "-i", str(out), "-frames:v", "1", "-q:v", "3", str(VID / f"{name}.jpg")], check=True, capture_output=True)
    for i, frac in enumerate((0.1, 0.35, 0.6, 0.85)):
        subprocess.run([FFMPEG, "-y", "-ss", f"{dur*frac:.2f}", "-i", str(out), "-frames:v", "1", "-vf", "scale=360:-2", "-q:v", "6", str(TH / f"{name}-{i+1}.jpg")], capture_output=True)
    report.append(f"ok video {name} {out.stat().st_size // 1024}KB dur={dur:.1f}s")

for name, fid in MAN.get("images", {}).items():
    dest = RAW / f"{name}.bin"
    if drive_download(fid, dest):
        try: save_image(dest, name)
        except Exception as e: report.append(f"FALHA imagem {name}: {e}")

for name, fid in MAN.get("videos", {}).items():
    dest = RAW / f"{name}.mp4"
    if drive_download(fid, dest):
        try: save_video(dest, name)
        except Exception as e: report.append(f"FALHA video {name}: {e}")

# quadros de vídeo usados como foto (nome: [vídeo, fração da duração])
for name, (vid, frac) in MAN.get("frames", {}).items():
    src = VID / f"{vid}.mp4"
    if not src.exists() or not FFMPEG:
        report.append(f"FALHA frame {name}: vídeo {vid} indisponível"); continue
    try:
        dur = duration_of(src)
        tmp = RAW / f"frame-{name}.png"
        subprocess.run([FFMPEG, "-y", "-ss", f"{dur*frac:.2f}", "-i", str(src), "-frames:v", "1", str(tmp)], check=True, capture_output=True)
        save_image(tmp, name)
    except Exception as e:
        report.append(f"FALHA frame {name}: {e}")

# imagem para compartilhamento (WhatsApp/Instagram): 1200x630 jpg
try:
    og_src = MAN.get("og", "paella")
    im = Image.open(IMG / f"{og_src}.webp").convert("RGB")
    w, h = im.size; tw, th = 1200, 630
    scale = max(tw / w, th / h); im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    l, t = (im.width - tw) // 2, (im.height - th) // 2
    im.crop((l, t, l + tw, t + th)).save(ASSETS / "og.jpg", "JPEG", quality=82, optimize=True)
    report.append("ok og.jpg")
except Exception as e:
    report.append(f"FALHA og: {e}")

for name, url in MAN.get("urls", {}).items():
    ext = os.path.splitext(url.split("?")[0])[1] or ".bin"
    dest = BRAND / f"{name}{ext}"
    if url_download(url, dest):
        try:
            im = Image.open(dest); t = im.copy(); t.thumbnail((360, 360)); t.convert("RGB").save(TH / f"{name}.jpg", "JPEG", quality=70)
            report.append(f"ok url {name} {im.size} {im.mode}")
        except Exception as e: report.append(f"ok url {name} (não-imagem) {e}")

(ASSETS / "REPORT.txt").write_text("\n".join(report) + "\n")
print("\n".join(report))
