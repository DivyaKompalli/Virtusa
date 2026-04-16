import os
import glob

files = glob.glob('src/pages/*.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # replace "/ />" with " />"
    content = content.replace('/ />', ' />')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
print("done fix2")
