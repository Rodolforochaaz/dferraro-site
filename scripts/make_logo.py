#!/usr/bin/env python3
"""Gera a logo só com a escrita (fundo transparente, ouro) a partir de uma imagem com fundo sólido.
Uso: make_logo.py entrada.png saida.png [largura]"""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
target_w = int(sys.argv[3]) if len(sys.argv) > 3 else None

im = Image.open(src).convert("RGBA")
a = np.asarray(im).astype(np.float32)
rgb, alpha = a[..., :3], a[..., 3]

if alpha.min() < 10 and (alpha < 10).mean() > 0.2:
    # já tem transparência: só recolore em ouro mantendo o alpha
    mask = alpha / 255.0
else:
    # cor de fundo = mediana das bordas
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((rgb - bg) ** 2).sum(-1))
    lo, hi = np.percentile(dist, 55), np.percentile(dist, 99)
    lo = max(lo, 18); hi = max(hi, lo + 30)
    mask = np.clip((dist - lo) / (hi - lo), 0, 1)
    mask = mask ** 0.85

# recorta pelas bordas úteis
ys, xs = np.where(mask > 0.05)
pad = 6
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, mask.shape[0] - 1)
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, mask.shape[1] - 1)
mask = mask[y0:y1 + 1, x0:x1 + 1]

gold = np.array([212, 176, 106], dtype=np.float32)  # #D4B06A
h, w = mask.shape
outa = np.zeros((h, w, 4), dtype=np.float32)
outa[..., :3] = gold
outa[..., 3] = mask * 255
img = Image.fromarray(outa.astype(np.uint8), "RGBA")
if target_w and img.width != target_w:
    img = img.resize((target_w, round(img.height * target_w / img.width)), Image.LANCZOS)
img.save(out, "PNG", optimize=True)
print(out, img.size)
