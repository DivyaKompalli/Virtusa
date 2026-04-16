import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from pypdf import PdfReader, PdfWriter
from pathlib import Path


# ---------------- TEXT WRAPPING ----------------
def draw_multiline(can, text, x, y, max_width=480, line_height=12, max_lines=4):
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    words = text.split()
    if not words:
        return

    lines = []
    current = words[0]

    for w in words[1:]:
        test = current + " " + w
        if can.stringWidth(test, "Helvetica", 10) <= max_width:
            current = test
        else:
            lines.append(current)
            current = w
    lines.append(current)

    # limit lines to avoid overflow
    for i, line in enumerate(lines[:max_lines]):
        can.drawString(x, y - i * line_height, line)


# ---------------- MAIN FUNCTION ----------------
def fill_pa_form(data: dict, template_path: str, output_path: str):
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=letter)
    can.setFont("Helvetica", 10)

    # -------- MEMBER INFO --------
    can.drawString(115, 652, data.get("name", ""))
    can.drawString(115, 636, data.get("member_id", ""))
    can.drawString(115, 626, data.get("dob", ""))
    can.drawString(115, 602, data.get("address", ""))

    can.drawString(85, 592, data.get("city", ""))
    can.drawString(170, 592, data.get("state", ""))
    can.drawString(260, 592, data.get("zip", ""))

    can.drawString(115, 572, data.get("phone", ""))
    can.drawString(245, 572, data.get("allergies", ""))

    # -------- PROVIDER INFO --------
    can.drawString(400, 652, data.get("provider", ""))
    can.drawString(350, 636, data.get("npi", ""))
    can.drawString(495, 636, data.get("specialty", ""))

    can.drawString(400, 626, data.get("office_phone", ""))
    can.drawString(390, 612, data.get("office_fax", ""))

    can.drawString(450, 592, data.get("office_address", ""))
    can.drawString(340, 572, data.get("office_city", ""))
    can.drawString(445, 572, data.get("office_state", ""))
    can.drawString(540, 572, data.get("office_zip", ""))

    # -------- CHECKBOXES --------
    can.drawString(168, 548, "X")  # New
    can.drawString(245, 532, "X")  # Not hospitalized
    can.drawString(225, 516, "X")  # Not pregnant

    # -------- MEDICATION --------
    can.drawString(115, 472, data.get("medication", ""))
    can.drawString(450, 472, data.get("strength", ""))

    draw_multiline(can, data.get("directions", ""), 115, 456, 300)
    can.drawString(450, 456, data.get("quantity", ""))

    can.drawString(242, 444, "X")  # Self-administered

    # -------- CLINICAL --------
    diag_text = data.get("diagnosis", "")
    can.drawString(330, 412, diag_text[:35])
    can.drawString(35, 398, diag_text[35:120])
    
    can.drawString(115, 385, data.get("icd", ""))

    draw_multiline(can, data.get("history", ""), 70, 285, 480)
    draw_multiline(can, data.get("contra", ""), 70, 210, 480)
    draw_multiline(can, data.get("labs", ""), 70, 176, max_width=480, line_height=14)
    draw_multiline(can, data.get("additional", ""), 70, 120, 480)

    # -------- SIGNATURE --------
    can.setFont("Helvetica-Oblique", 12)
    can.drawString(140, 66, data.get("provider", ""))
    can.setFont("Helvetica", 10)
    can.drawString(450, 66, data.get("date", ""))

    can.save()
    packet.seek(0)

    # -------- MERGE WITH TEMPLATE --------
    new_pdf = PdfReader(packet)
    writer = PdfWriter()
    template_file = Path(template_path)

    if template_file.is_file():
        with open(template_file, "rb") as template_handle:
            existing_pdf = PdfReader(template_handle)
            page = existing_pdf.pages[0]
            page.merge_page(new_pdf.pages[0])
            writer.add_page(page)
    else:
        # Fallback: still produce a usable PDF if the template file is absent.
        writer.add_page(new_pdf.pages[0])

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path