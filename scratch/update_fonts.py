import os
import re

src_dir = r'c:\Users\user\Desktop\fridgr.1.1.1\src'

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update imports from styles/theme
    if '../styles/theme' in content or '../../styles/theme' in content:
        # Match cases like { colors, fontSize, fontWeight, ... }
        import_pattern = re.compile(r'import\s+\{\s*([^}]*)\s*\}\s+from\s+[\'\"](\.\.?/)+styles/theme[\'\"]')
        match = import_pattern.search(content)
        if match:
            import_block = match.group(1)
            if 'fontFamily' not in import_block:
                if 'fontWeight' in import_block:
                    new_import_block = import_block.replace('fontWeight', 'fontFamily, fontWeight')
                    content = content.replace(import_block, new_import_block)
                else:
                    new_import_block = import_block.strip() + ', fontFamily'
                    content = content.replace(import_block, new_import_block)

    # 2. Update styles that use fontWeight from theme
    # Case: fontWeight: fontWeight.extrabold
    content = re.sub(r'fontWeight:\s*fontWeight\.(extrabold|bold|semibold|medium|regular)', 
                     r'fontFamily: fontFamily.\1, fontWeight: fontWeight.\1', content)

    # Case: fontWeight: '800' etc (direct strings)
    weight_map = {
        "'800'": "'Poppins_800ExtraBold'",
        '"800"': "'Poppins_800ExtraBold'",
        "'700'": "'Poppins_700Bold'",
        '"700"': "'Poppins_700Bold'",
        "'600'": "'Poppins_600SemiBold'",
        '"600"': "'Poppins_600SemiBold'",
        "'500'": "'Poppins_500Medium'",
        '"500"': "'Poppins_500Medium'",
        "'400'": "'Poppins_400Regular'",
        '"400"': "'Poppins_400Regular'",
    }
    for weight, family in weight_map.items():
        content = content.replace(f'fontWeight: {weight}', f'fontFamily: {family}, fontWeight: {weight}')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            update_file(os.path.join(root, file))

print("Update complete!")
