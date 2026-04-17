const fs = require('fs');
const path = require('path');

const srcDir = path.join('c:', 'Users', 'user', 'Desktop', 'fridgr.1.1.1', 'src');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let lines = content.split('\n');
    let newLines = [];
    let seenFontFamily = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // If we see multiple fontFamily lines in the same block, keep only the one that has both fontFamily and fontWeight if possible
        if (line.includes('fontFamily:')) {
            if (seenFontFamily) {
                // Skip redundant fontFamily lines
                continue;
            }
            seenFontFamily = true;
        }

        // Reset seenFontFamily when we exit a style object
        if (line.includes('},') || line.includes('}')) {
            seenFontFamily = false;
        }

        newLines.push(line);
    }

    const newContent = newLines.join('\n');
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Cleaned: ${filePath}`);
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
            cleanFile(filePath);
        }
    });
}

walk(srcDir);
console.log('Done!');
