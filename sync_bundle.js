import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const OUTPUT_FILE = path.join(ROOT_DIR, 'age_friend_seal_source_code.txt');

const ROOT_CONFIG_FILES = [
  'index.html',
  'vite.config.js',
  'package.json',
  '.gitignore',
  'firestore.rules'
];

const SCAN_DIRS = [
  'src',
  'api',
  'public/info'
];

function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getFilesRecursively(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (['.js', '.jsx', '.scss', '.css', '.html', '.rules', '.json'].includes(ext) && file !== 'package-lock.json') {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

async function generateBundle() {
  let content = `========================================================================
AGE FRIEND SEAL - FULL SOURCE CODE BUNDLE
========================================================================

--- ROOT CONFIGURATION FILES ---

`;

  // 1. Process root config files
  for (const file of ROOT_CONFIG_FILES) {
    const filePath = path.join(ROOT_DIR, file);
    if (fs.existsSync(filePath)) {
      console.log(`Bundling root config: ${file}`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      content += `// ==========================================\n`;
      content += `// FILE: ${file}\n`;
      content += `// ==========================================\n\n`;
      content += fileContent;
      content += `\n\n\n\n`;
    }
  }

  // 2. Process scan dirs
  for (const scanDir of SCAN_DIRS) {
    const dirPath = path.join(ROOT_DIR, scanDir);
    if (fs.existsSync(dirPath)) {
      content += `--- FILES IN ${scanDir.toUpperCase()} ---\n\n`;
      const files = getFilesRecursively(dirPath);
      for (const filePath of files) {
        const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
        // Skip sync_bundle.js itself if it falls into scan list
        if (relativePath === 'sync_bundle.js' || relativePath === 'age_friend_seal_source_code.txt') {
          continue;
        }
        console.log(`Bundling: ${relativePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        content += `// ==========================================\n`;
        content += `// FILE: ${relativePath}\n`;
        content += `// ==========================================\n\n`;
        content += fileContent;
        content += `\n\n\n\n`;
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`\nSuccessfully generated bundle: ${OUTPUT_FILE} (${fs.statSync(OUTPUT_FILE).size} bytes)`);
}

generateBundle().catch(err => {
  console.error('Error generating bundle:', err);
  process.exit(1);
});
