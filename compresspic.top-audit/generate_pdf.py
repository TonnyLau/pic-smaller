#!/usr/bin/env python3
"""Generate a PDF audit report from FULL-AUDIT-REPORT.md using reportlab."""
import re
import json
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
)

ROOT = Path("E:/project/ship/pic-smaller/compresspic.top-audit")
DATA = json.loads((ROOT / "audit-data.json").read_text(encoding="utf-8"))
REPORT_MD = (ROOT / "FULL-AUDIT-REPORT.md").read_text(encoding="utf-8")

styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    "TitleStyle", parent=styles["Title"], fontSize=24, textColor=colors.HexColor("#0f172a"),
    spaceAfter=20, alignment=TA_LEFT, leading=30,
)
h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=18, textColor=colors.HexColor("#0f172a"),
                    spaceBefore=18, spaceAfter=10, leading=22)
h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=14, textColor=colors.HexColor("#1e293b"),
                    spaceBefore=14, spaceAfter=8, leading=18)
h3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=12, textColor=colors.HexColor("#334155"),
                    spaceBefore=10, spaceAfter=6, leading=16)
body = ParagraphStyle("Body", parent=styles["BodyText"], fontSize=10, textColor=colors.HexColor("#1f2937"),
                      spaceAfter=8, leading=14)
small = ParagraphStyle("Small", parent=body, fontSize=9, textColor=colors.HexColor("#475569"))
code = ParagraphStyle("Code", parent=body, fontName="Courier", fontSize=8.5,
                      backColor=colors.HexColor("#f1f5f9"), borderColor=colors.HexColor("#cbd5e1"),
                      borderWidth=0.5, borderPadding=6, leftIndent=0, rightIndent=0, spaceAfter=8)


def md_inline_to_html(s: str) -> str:
    """Convert minimal markdown to ReportLab paragraph HTML."""
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # bold
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    # italic
    s = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r"<i>\1</i>", s)
    # inline code
    s = re.sub(r"`([^`]+)`", r'<font face="Courier" color="#0f766e">\1</font>', s)
    # links — just show the text
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return s


def render_markdown(md_text: str, flow):
    """Walk markdown line by line and emit flowables."""
    lines = md_text.splitlines()
    i = 0
    in_code = False
    code_buf = []

    def flush_code():
        nonlocal code_buf
        if code_buf:
            text = "\n".join(code_buf)
            flow.append(Paragraph(md_inline_to_html(text), code))
            flow.append(Spacer(1, 4))
            code_buf = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Fenced code block
        if stripped.startswith("```"):
            if in_code:
                in_code = False
                flush_code()
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue

        if not stripped:
            flow.append(Spacer(1, 4))
            i += 1
            continue

        # Headings
        if stripped.startswith("### "):
            flow.append(Paragraph(md_inline_to_html(stripped[4:]), h3))
        elif stripped.startswith("## "):
            flow.append(Paragraph(md_inline_to_html(stripped[3:]), h2))
        elif stripped.startswith("# "):
            flow.append(Paragraph(md_inline_to_html(stripped[2:]), h1))
        # Tables (very simple: only GFM tables with `|` delimiters)
        elif stripped.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s\-\|:]+\|\s*$", lines[i + 1].strip()):
            tbl_rows = []
            j = i
            while j < len(lines) and lines[j].strip().startswith("|"):
                cells = [c.strip() for c in lines[j].strip().strip("|").split("|")]
                tbl_rows.append(cells)
                j += 1
            i = j
            # First row is header, second is separator
            data = [tbl_rows[0]] + tbl_rows[2:] if len(tbl_rows) >= 3 else tbl_rows
            tbl = Table(data, repeatRows=1, hAlign="LEFT")
            tbl.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1),
                 [colors.white, colors.HexColor("#f8fafc")]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]))
            flow.append(tbl)
            flow.append(Spacer(1, 8))
            continue
        # Blockquote
        elif stripped.startswith("> "):
            flow.append(Paragraph(md_inline_to_html(stripped[2:]), body))
        # Unordered list
        elif re.match(r"^[-*]\s+", stripped):
            text = re.sub(r"^[-*]\s+", "", stripped)
            flow.append(Paragraph("• " + md_inline_to_html(text), body))
        # Ordered list
        elif re.match(r"^\d+\.\s+", stripped):
            text = re.sub(r"^\d+\.\s+", "", stripped)
            flow.append(Paragraph(md_inline_to_html(text), body))
        # Horizontal rule
        elif stripped == "---":
            flow.append(Spacer(1, 6))
        else:
            flow.append(Paragraph(md_inline_to_html(stripped), body))
        i += 1


def cover_page(flow):
    summary = DATA["summary"]
    flow.append(Spacer(1, 3 * cm))
    flow.append(Paragraph("SEO Audit Report", title_style))
    flow.append(Paragraph(summary["url"], h2))
    flow.append(Spacer(1, 0.5 * cm))
    flow.append(Paragraph(f"Audit date: {summary['audit_date']}", body))
    flow.append(Paragraph(f"Domain: {summary['domain']}", body))
    flow.append(Paragraph(f"Business type: {summary['business_type']}", body))
    flow.append(Paragraph(f"Stack: {summary['stack']}", body))
    flow.append(Paragraph(f"Indexed pages: {summary['indexable_pages']}", body))
    flow.append(Spacer(1, 1 * cm))

    # Health score big
    score = summary["health_score"]
    score_color = colors.HexColor("#16a36d") if score >= 80 else (
        colors.HexColor("#ca8a04") if score >= 60 else colors.HexColor("#dc2626"))
    score_style = ParagraphStyle("Score", parent=title_style, fontSize=64,
                                 textColor=score_color, alignment=TA_LEFT)
    flow.append(Paragraph(f"{score} / 100", score_style))
    flow.append(Paragraph("SEO Health Score", h3))
    flow.append(Spacer(1, 0.5 * cm))

    # Category scores
    flow.append(Paragraph("Category Scores", h2))
    rows = [["Category", "Score"]]
    for cat in summary.get("categories", DATA["categories"]):
        rows.append([cat["name"], f"{cat['score']} / 100"])
    tbl = Table(rows, colWidths=[10 * cm, 4 * cm], hAlign="LEFT")
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
    ]))
    flow.append(tbl)
    flow.append(Spacer(1, 0.8 * cm))

    # Top findings
    flow.append(Paragraph("Top Critical Issues", h2))
    for f in summary["top_findings"]:
        sev = f.get("severity", "")
        sev_color = {
            "Critical": colors.HexColor("#dc2626"),
            "High": colors.HexColor("#ea580c"),
            "Medium": colors.HexColor("#ca8a04"),
            "Low": colors.HexColor("#2563eb"),
        }.get(sev, colors.HexColor("#64748b"))
        line = f'<font color="{sev_color.hexval()}"><b>[{sev}]</b></font> {md_inline_to_html(f["title"])}'
        flow.append(Paragraph(line, body))

    flow.append(Spacer(1, 0.4 * cm))
    flow.append(Paragraph("Top Quick Wins", h2))
    for q in summary["quick_wins"]:
        flow.append(Paragraph("• " + md_inline_to_html(q), body))

    flow.append(PageBreak())


def main():
    output_pdf = ROOT / "compresspic.top-audit-report.pdf"
    doc = SimpleDocTemplate(
        str(output_pdf), pagesize=A4,
        leftMargin=2 * cm, rightMargin=2 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm,
        title="compresspic.top SEO Audit",
        author="claude-seo",
    )
    flow = []
    cover_page(flow)
    render_markdown(REPORT_MD, flow)

    def add_page_number(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#94a3b8"))
        canvas.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f"Page {doc.page}")
        canvas.drawString(2 * cm, 1.2 * cm, "compresspic.top SEO Audit — 2026-06-22")
        canvas.restoreState()

    doc.build(flow, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"PDF written: {output_pdf}")
    print(f"Size: {output_pdf.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
