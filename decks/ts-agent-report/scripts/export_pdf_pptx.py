#!/usr/bin/env python3
"""从 index.html 一键导出 16:9 矢量 PDF 与 PPTX。依赖: weasyprint, pypdfium2, python-pptx"""
import re, tempfile
from pathlib import Path
import weasyprint, pypdfium2 as pdfium
from pptx import Presentation
from pptx.util import Inches

ROOT = Path(__file__).resolve().parent.parent
HTML_IN = ROOT / "index.html"
PDF_OUT = ROOT / "dist" / "ts_agent_report.pdf"
PPTX_OUT = ROOT / "dist" / "ts_agent_report.pptx"

short_labels = [
    "1 本质要素", "2 时序结合", "3 分类总览",
    "4 预测推理", "5 增强合成", "6 异常诊断", "7 决策支持",
    "8 TimeCopilot", "9 TS-Reasoner", "10 NEXUS", "11 思考",
]

html = HTML_IN.read_text(encoding="utf-8")
html = re.sub(r"<!-- Presenter HUD -->.*", "</body></html>", html, flags=re.S)
idx = [0]
def _fill(_):
    i = idx[0]; idx[0] += 1
    pills = [f'<span class="agenda-pill{" active" if j == i else ""}">{l}</span>' for j, l in enumerate(short_labels)]
    return '<nav class="slide-agenda-rail">' + "".join(pills) + "</nav>"
html = re.sub(r'<nav class="slide-agenda-rail"></nav>', _fill, html)
html = html.replace("</head>", """
<style>
  @page { size: 1920px 1080px; margin: 0; }
  html, body { width: 1920px; height: auto; overflow: visible; background: #fff; }
  .viewport-scaler, .presentation-stage { display: block; width: 1920px; height: auto; box-shadow: none; transform: none !important; }
  .slide { position: relative !important; inset: auto !important; display: flex !important; width: 1920px; height: 1080px; page-break-after: always; }
  .slide:last-child { page-break-after: auto; }
</style></head>""", 1)

PDF_OUT.parent.mkdir(parents=True, exist_ok=True)
weasyprint.HTML(string=html).write_pdf(str(PDF_OUT))

doc = pdfium.PdfDocument(str(PDF_OUT))
prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333333), Inches(7.5)
with tempfile.TemporaryDirectory() as td:
    for i in range(len(doc)):
        p = Path(td) / f"s{i+1:02d}.png"
        doc[i].render(scale=1.333333).to_pil().save(str(p))
        prs.slides.add_slide(prs.slide_layouts[6]).shapes.add_picture(str(p), 0, 0, prs.slide_width, prs.slide_height)
prs.save(str(PPTX_OUT))
print("Exported:", PDF_OUT, PPTX_OUT)
