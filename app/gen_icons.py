# -*- coding: utf-8 -*-
"""生成观己 App 图标（渐变紫背景 + 白色上升折线符号）"""
from PIL import Image, ImageDraw

RES = r"D:/锁魂涧12生肖-魔/新APP/app/android/app/src/main/res"
C1 = (109, 93, 240)   # #6d5df0
C2 = (199, 139, 245)  # #c78bf5
WHITE = (255, 255, 255)

def gradient(w, h, c1, c2):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / (h - 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        d.line([(0, y), (w, y)], fill=(r, g, b))
    return img

def draw_symbol(img, box):
    """在 box=(x0,y0,x1,y1) 内画上升折线 + 圆点"""
    x0, y0, x1, y1 = box
    d = ImageDraw.Draw(img)
    pts = [
        (x0 + (x1 - x0) * 0.06, y1 - (y1 - y0) * 0.10),
        (x0 + (x1 - x0) * 0.50, y0 + (y1 - y0) * 0.50),
        (x1 - (x1 - x0) * 0.06, y0 + (y1 - y0) * 0.12),
    ]
    lw = max(4, int((x1 - x0) * 0.10))
    d.line(pts, fill=WHITE, width=lw, joint="curve")
    r = int((x1 - x0) * 0.115)
    for p in pts:
        d.ellipse([p[0]-r, p[1]-r, p[0]+r, p[1]+r], fill=WHITE)
    return img

S = 1024

# 1) legacy 方形图标（渐变背景 + 符号，留边距）
legacy = gradient(S, S, C1, C2)
draw_symbol(legacy, (int(S*0.14), int(S*0.22), int(S*0.86), int(S*0.78)))

# 2) 圆形图标
round_img = gradient(S, S, C1, C2)
draw_symbol(round_img, (int(S*0.16), int(S*0.24), int(S*0.84), int(S*0.76)))
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).ellipse([0, 0, S, S], fill=255)
round_img.putalpha(mask)

# 3) adaptive 前景（透明背景 + 符号居中安全区）
fg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
draw_symbol(fg, (int(S*0.30), int(S*0.32), int(S*0.70), int(S*0.68)))

legacy_sizes = {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}
fg_sizes = {'mdpi': 108, 'hdpi': 162, 'xhdpi': 216, 'xxhdpi': 324, 'xxxhdpi': 432}

import os
for dpi, size in legacy_sizes.items():
    d = os.path.join(RES, f"mipmap-{dpi}")
    legacy.resize((size, size), Image.LANCZOS).save(os.path.join(d, "ic_launcher.png"))
    round_img.resize((size, size), Image.LANCZOS).save(os.path.join(d, "ic_launcher_round.png"))
for dpi, size in fg_sizes.items():
    d = os.path.join(RES, f"mipmap-{dpi}")
    fg.resize((size, size), Image.LANCZOS).save(os.path.join(d, "ic_launcher_foreground.png"))

# 预览图
legacy.resize((256, 256), Image.LANCZOS).save(r"D:/锁魂涧12生肖-魔/新APP/app/icon_preview.png")
print("icons generated OK")
