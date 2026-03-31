import os
import re

src_dir = 'c:/Users/EraElectronics/Desktop/fridgr.1.1.1/src'

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            if 'backgroundColor: \'#fff\'' in content or 'colors.bgCard' in content:
                # Add import if missing and BlurView might be used
                if 'import { BlurView }' not in content:
                    content = content.replace("import React", "import React\nimport { BlurView } from 'expo-blur';", 1)

                content = content.replace("backgroundColor: '#fff'", "backgroundColor: colors.bgCard")
                # Just replacing '#fff' with translucent colors.bgCard handles 80% of the glass look with the new theme
                
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
