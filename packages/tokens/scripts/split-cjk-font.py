#!/usr/bin/env python3
"""把江城圆体按 unicode-range 切成小块 woff2，浏览器只下载页面用到的分片。

覆盖范围：GB2312 全部 6763 个汉字 + 中文标点 + 全角符号。
一级常用字（3755 个）排在前面，单独成片，常见页面通常只需加载其中几片。
范围外的字会落到 font-family 里的下一个字体（Noto Sans SC / 系统字体）。

用法：
  pip install fonttools brotli
  python3 scripts/split-cjk-font.py <字体目录>
字体目录里需要有 A-江城圆体-400W.ttf / 500W / 700W。
"""

import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

WEIGHTS = {400: "A-江城圆体-400W.ttf", 500: "A-江城圆体-500W.ttf", 700: "A-江城圆体-700W.ttf"}
FAMILY = "Jiangcheng Yuanti"
CHUNK = 300
OUT = Path(__file__).resolve().parent.parent / "fonts" / "jiangcheng"


def gb2312_chars():
    level1, level2 = [], []
    for hi in range(0xB0, 0xF8):
        for lo in range(0xA1, 0xFF):
            try:
                ch = bytes([hi, lo]).decode("gb2312")
            except UnicodeDecodeError:
                continue
            (level1 if hi <= 0xD7 else level2).append(ord(ch))
    return level1, level2


def symbols():
    cps = set(range(0x3000, 0x3040))  # CJK 标点
    cps |= set(range(0xFF01, 0xFF5F))  # 全角 ASCII
    cps |= {0x2014, 0x2026, 0x2018, 0x2019, 0x201C, 0x201D, 0x00B7}
    return sorted(cps)


def to_ranges(cps):
    cps = sorted(cps)
    out, start, prev = [], cps[0], cps[0]
    for c in cps[1:]:
        if c == prev + 1:
            prev = c
            continue
        out.append((start, prev))
        start = prev = c
    out.append((start, prev))
    return ",".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in out)


def main(src_dir):
    level1, level2 = gb2312_chars()
    chunks = [symbols()]
    for group in (level1, level2):
        chunks += [group[i : i + CHUNK] for i in range(0, len(group), CHUNK)]

    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.woff2"):
        old.unlink()

    css = [f"/* 由 scripts/split-cjk-font.py 生成，勿手改。{FAMILY}，SIL OFL 1.1 */"]
    for weight, filename in WEIGHTS.items():
        font_path = Path(src_dir) / filename
        cmap = TTFont(font_path).getBestCmap()
        for i, chunk in enumerate(chunks):
            cps = [c for c in chunk if c in cmap]
            if not cps:
                continue
            name = f"jiangcheng-{weight}-{i:02d}.woff2"
            opts = subset.Options()
            opts.flavor = "woff2"
            opts.layout_features = ["*"]
            opts.name_IDs = ["*"]
            font = subset.load_font(str(font_path), opts)
            sub = subset.Subsetter(opts)
            sub.populate(unicodes=cps)
            sub.subset(font)
            subset.save_font(font, str(OUT / name), opts)
            css.append(
                "@font-face{"
                f'font-family:"{FAMILY}";font-style:normal;font-weight:{weight};font-display:swap;'
                f'src:url("./jiangcheng/{name}") format("woff2");'
                f"unicode-range:{to_ranges(cps)}}}"
            )
        print(f"{weight}: done")

    (OUT.parent / "jiangcheng.css").write_text("\n".join(css) + "\n", encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
