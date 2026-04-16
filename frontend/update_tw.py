import json
import re

html_path = r"f:\DivyaKompalli\Virtusa\stitch\stitch\authorization_status_decision_detail\code.html"
tw_path = r"f:\DivyaKompalli\Virtusa\AutoAuth\AutoAuth\frontend\tailwind.config.ts"

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Extract the JSON object from tailwind.config = ...
match = re.search(r'tailwind\.config = \{(.*?)\}', html, re.DOTALL)
if match:
    # Need to extract the extend object inside theme
    config_str = match.group(0)
    colors_match = re.search(r'"colors": (\{.*?\})', config_str, re.DOTALL)
    if colors_match:
        colors_json = colors_match.group(1)
        colors_dict = json.loads(colors_json)
        
        # generate a JS string representation of the new colors
        new_colors_js = ""
        for k, v in colors_dict.items():
            # some keys might have hyphens
            safe_key = f'"{k}"' if '-' in k else k
            new_colors_js += f'        {safe_key}: "{v}",\n'
            
        with open(tw_path, 'r', encoding='utf-8') as f:
            tw_content = f.read()
            
        # find extend: { colors: {
        # inject new colors inside colors
        tw_content = tw_content.replace('colors: {\n', f'colors: {{\n{new_colors_js}')
        
        # add fonts
        font_js = """      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        headline: ["Manrope"],
        body: ["Inter"],
        label: ["Inter"]
      },"""
        tw_content = re.sub(r'fontFamily: \{.*?\},', font_js, tw_content, flags=re.DOTALL)
        
        with open(tw_path, 'w', encoding='utf-8') as f:
            f.write(tw_content)
        
        print("Updated tailwind config.")
