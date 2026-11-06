#!/usr/bin/env python3
"""Baixa as mídias do Google Drive (links públicos), otimiza para web e grava em assets/.
Roda no GitHub Actions (ver .github/workflows/media.yml)."""
import json, os, subprocess, sys, shutil, urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MAN = json.loads((ROOT / "scripts" / "media_manifest.json").read_text())
RAW = ROOT / ".raw"; RAW.mkdir(exist_ok=True)
IMG = ROOT / "assets" / "img"; IMG.mkdir(parents=True, exist_ok=True)
VID = ROOT / "assets" / "video"; VID.mkdir(parents=True, exist_ok=True)
TH = ROOT / "assets" / "thumbs"; TH.mkdir(parents=True, exist_ok=True)
BRAND = ROOT / "assets" / "brand"; BRAND.mkdir(parents=True, exist_ok=True)
report = []

def drive_download(file_id, dest):
    try:
        subprocess.run([sys.executable, "-m", "gdown", "--fuzzy", "-O", str(dest), f"https://drive.google.com/uc?id={file_id}"], check=True, timeout=600)
        return dest.exists() and dest.stat().st_size > 1000
    except Exception as e:
        report.append(f"FALHA download {file_id}: {e}")
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

def save_image(src, name):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
    w, h = im.size
    for suffix, maxw in (("", 1800), ("-m", 960)):
        c = im.copy()
        if c.width > maxw:
            c = c.resize((maxw, round(h * maxw / w)), Image.LANCZOS)
        out = IMG / f"{name}{suffix}.webp"
        c.convert("RGB").save(out, "WEBP", quality=80, method=6)
    t = im.copy(); t.thumbnail((360, 360), Image.LANCZOS)
    t.convert("RGB").save(TH / f"{name}.jpg", "JPEG", quality=70)
    report.append(f"ok imagem {name} {w}x{h}")

def save_video(src, name):
    out = VID / f"{name}.mp4"
    cmd = ["ffmpeg", "-y", "-i", str(src), "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264", "-crf", "27",
           "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True, capture_output=True)
    subprocess.run(["ffmpeg", "-y", "-ss", "1", "-i", str(out), "-frames:v", "1", "-q:v", "3", str(VID / f"{name}.jpg")], check=True, capture_output=True)
    # 4 frames para revisão
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)], capture_output=True, text=True)
    dur = float(probe.stdout.strip() or 4)
    for i, frac in enumerate((0.1, 0.35, 0.6, 0.85)):
        subprocess.run(["ffmpeg", "-y", "-ss", f"{dur*frac:.2f}", "-i", str(out), "-frames:v", "1", "-vf", "scale=360:-2", "-q:v", "6", str(TH / f"{name}-{i+1}.jpg")], capture_output=True)
    size = out.stat().st_size // 1024
    report.append(f"ok video {name} {size}KB dur={dur:.1f}s")

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

for name, url in MAN.get("urls", {}).items():
    ext = os.path.splitext(url.split("?")[0])[1] or ".bin"
    dest = BRAND / f"{name}{ext}"
    if url_download(url, dest):
        try:
            im = Image.open(dest); t = im.copy(); t.thumbnail((360, 360)); t.convert("RGB").save(TH / f"{name}.jpg", "JPEG", quality=70)
            report.append(f"ok url {name} {im.size} {im.mode}")
        except Exception as e: report.append(f"ok url {name} (não-imagem) {e}")

(ROOT / "assets" / "REPORT.txt").write_text("\n".join(report) + "\n")
print("\n".join(report))
