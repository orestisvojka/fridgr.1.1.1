const fs = require('fs');
const mockDataPath = 'c:\\Users\\EraElectronics\\Desktop\\fridgr.1.1.1\\src\\data\\mockData.js';
const mockRecipesPath = 'c:\\Users\\EraElectronics\\Desktop\\fridgr.1.1.1\\src\\data\\mockRecipes.js';

function cleanEmojis(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/^\s*emoji:\s*['"].*?['"],\n/gm, '');
  content = content.replace(/,\s*icon:\s*['"].*?['"]/g, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${filePath}`);
}

cleanEmojis(mockDataPath);
cleanEmojis(mockRecipesPath);
