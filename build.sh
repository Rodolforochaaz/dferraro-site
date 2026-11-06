#!/usr/bin/env bash
# Build na Vercel: baixa e otimiza as mídias do Drive para public/assets e gera a logo sem fundo.
set -u
echo "python: $(python3 --version 2>&1)"
python3 -m venv .venv && . .venv/bin/activate
pip install -q gdown pillow numpy imageio-ffmpeg 2>&1 | tail -2
python scripts/fetch_media.py || echo "fetch_media terminou com avisos (o site segue no ar)"

B=public/assets/brand
if [ -f "$B/logo-oficial.png" ] && python scripts/make_logo.py "$B/logo-oficial.png" "$B/logo.png" 1400; then
  echo "logo: oficial"
else
  cp "$B/logo-fallback.png" "$B/logo.png"; echo "logo: fallback"
fi
python scripts/make_favicon.py "$B/logo.png" "$B/favicon.png" || true
cat public/assets/REPORT.txt 2>/dev/null || true
echo "build ok"
