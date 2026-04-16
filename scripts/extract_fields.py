import os
import sys
from pypdf import PdfReader

# Automatically resolve the project root to find data/inputs
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pdf_path = os.path.join(root_dir, "data", "inputs", "PA-Request-Form-UHC-Community-Plan.pdf")

reader = PdfReader(pdf_path)
fields = reader.get_form_text_fields()
if fields:
    print("Form fields found:")
    for k, v in fields.items():
        print(f"{k}: {v}")
else:
    print("No AcroForm text fields found.")
