
import os
import re

src_dir = r'c:\Users\user\Desktop\FRIDGR\src'
pattern = re.compile(r'\bshadows\.\w+')
import_pattern = re.compile(r'import\s+.*?\bshadows\b.*?from')

missing = []

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                if pattern.search(content):
                    if not import_pattern.search(content):
                        missing.append(path)

print("Files missing 'shadows' import but using it:")
for m in missing:
    print(m)
