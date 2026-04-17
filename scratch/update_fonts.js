const fs = require('fs');
const path = require('path');

const srcDir = path.join('c:', 'Users', 'user', 'Desktop', 'fridgr.1.1.1', 'src');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // 1. Update imports from styles/theme
    const themeImportPattern = /import\s+\{\s*([^}]*)\s*\}\s+from\s+['"](\.\.?\/)+styles\/theme['"]/g;
    content = content.replace(themeImportPattern, (match, importBlock, dots) => {
        if (!importBlock.includes('fontFamily')) {
            modified = true;
            if (importBlock.includes('fontWeight')) {
                return match.replace('fontWeight', 'fontFamily, fontWeight');
            } else {
                return match.replace('}', ', fontFamily }');
            }
        }
        return match;
    });

    // 2. Update styles that use fontWeight from theme
    const weightPropPattern = /fontWeight:\s*fontWeight\.(extrabold|bold|semibold|medium|regular)/g;
    if (weightPropPattern.test(content)) {
        modified = true;
        content = content.replace(weightPropPattern, 'fontFamily: fontFamily.$1, fontWeight: fontWeight.$1');
    }

    // 3. Update direct string weights
    const directWeightPattern = /fontWeight:\s*['"](\d{3})['"]/g;
    const weightMap = {
        '800': 'Poppins_800ExtraBold',
        '700': 'Poppins_700Bold',
        '600': 'Poppins_600SemiBold',
        '500': 'Poppins_500Medium',
        '400': 'Poppins_400Regular',
    };
    content = content.replace(directWeightPattern, (match, weight) => {
        if (weightMap[weight]) {
            modified = true;
            return `fontFamily: '${weightMap[weight]}', fontWeight: '${weight}'`;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated: ${filePath}`);
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            updateFile(filePath);
        }
    });
}

walk(srcDir);
console.log('Done!');
