import os
import glob

files = glob.glob('src/pages/*.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('style="font-variation-settings: \'FILL\' 1;"', 'style={{fontVariationSettings: "\'FILL\' 1"}}')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
print("done")
