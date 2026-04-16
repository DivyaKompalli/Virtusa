import os
import re

STITCH_DIR = r"f:\DivyaKompalli\Virtusa\stitch\stitch"
PAGES_DIR = r"f:\DivyaKompalli\Virtusa\AutoAuth\AutoAuth\frontend\src\pages"
COMPONENTS_DIR = r"f:\DivyaKompalli\Virtusa\AutoAuth\AutoAuth\frontend\src\components"

os.makedirs(PAGES_DIR, exist_ok=True)
os.makedirs(COMPONENTS_DIR, exist_ok=True)

def html_to_jsx(html):
    # Regex basic fixes
    html = html.replace('class=', 'className=')
    html = html.replace('for=', 'htmlFor=')
    html = html.replace('<!--', '{/*')
    html = html.replace('-->', '*/}')
    
    # Self-closing tags regex
    html = re.sub(r'<(img|input|br|hr)([^>]*?)>', r'<\1\2 />', html)
    
    return html

# We will just take the layout once
sidebar_html = ""
topbar_html = ""

folders = os.listdir(STITCH_DIR)

for folder in folders:
    folder_path = os.path.join(STITCH_DIR, folder)
    if not os.path.isdir(folder_path):
        continue
        
    code_path = os.path.join(folder_path, "code.html")
    if not os.path.exists(code_path):
        continue
        
    with open(code_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Extract aside
    aside_match = re.search(r'<aside.*?</aside>', html, re.DOTALL)
    if aside_match and not sidebar_html:
        sidebar_html = aside_match.group(0)
        
    # Extract header
    header_match = re.search(r'<header.*?</header>', html, re.DOTALL)
    if header_match and not topbar_html:
        topbar_html = header_match.group(0)
        
    # Extract page content
    # Look for the content after header inside main, or just the div inside main
    main_match = re.search(r'<main.*?>(.*)</main>', html, re.DOTALL)
    if main_match:
        content = main_match.group(1)
        # remove header from content
        content = re.sub(r'<header.*?</header>', '', content, flags=re.DOTALL)
    else:
        # fallback
        r_div = re.search(r'<div class="p-8 max-w-7xl mx-auto space-y-8">.*?(?=</main>|</body>)', html, re.DOTALL)
        content = r_div.group(0) if r_div else html

    page_name = "".join([x.capitalize() for x in folder.split('_')])
    jsx = html_to_jsx(content)
    
    component_code = f"""import React from 'react';

const {page_name} = () => {{
  return (
    <>
      {jsx}
    </>
  );
}};

export default {page_name};
"""
    with open(os.path.join(PAGES_DIR, f"{page_name}.tsx"), 'w', encoding='utf-8') as f:
        f.write(component_code)

# Write Layout component
layout_jsx = html_to_jsx(f"""
    {sidebar_html}
    <main className="md:ml-64 min-h-screen pb-16 md:pb-0">
        {topbar_html}
        <div className="layout-content">
            {{children}}
        </div>
    </main>
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around py-3 px-4 z-50">
        <button className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-bold">Dash</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-cyan-700">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
            <span className="text-[10px] font-bold">New</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">library_books</span>
            <span className="text-[10px] font-bold">Policy</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-bold">Settings</span>
        </button>
    </nav>
""")

# replace {{children}} with {children}
layout_jsx = layout_jsx.replace("{children}", "{children}").replace("{{children}}", "{children}")
layout_jsx = layout_jsx.replace("style=\"font-variation-settings: 'FILL' 1;\"", "style={{fontVariationSettings: \"'FILL' 1\"}}")

layout_code = f"""import React from 'react';
import {{ Outlet }} from 'react-router-dom';

const Layout = () => {{
  const children = <Outlet />;
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      {layout_jsx}
    </div>
  );
}};

export default Layout;
"""

with open(os.path.join(COMPONENTS_DIR, "Layout.tsx"), 'w', encoding='utf-8') as f:
    f.write(layout_code)

print("Conversion complete.")
