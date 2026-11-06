#!/usr/bin/env python3
"""Favicon: logo em ouro sobre espresso, 128x128."""
import sys
from PIL import Image
logo = Image.open(sys.argv[1]).convert("RGBA")
size = 128
bg = Image.new("RGBA", (size, size), (26, 15, 8, 255))
w = int(size * .84)
l = logo.resize((w, round(logo.height * w / logo.width)), Image.LANCZOS)
bg.alpha_composite(l, ((size - l.width) // 2, (size - l.height) // 2))
bg.save(sys.argv[2], "PNG", optimize=True)
print(sys.argv[2])
