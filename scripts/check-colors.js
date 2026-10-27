/**
 * Color Guard Script
 * Ensures all colors across the frontend conform to semantic tokens.
 * Flags:
 * 1. Hardcoded Hex colors (#...) outside allowed token definition files
 * 2. Tailwind arbitrary color classes (bg-[#...], text-[#...], border-[#...], etc.)
 * 3. Unmapped Tailwind raw palette classes (bg-white, text-black, bg-slate-*, text-gray-*, bg-purple-*, bg-indigo-*, etc.)
 */

const fs = require('fs');
const path = require('path');

const ALLOWED_FILES = [
  'globals.css',
  'tailwind.config.ts',
  'tailwind.config.js',
  'status-colors.ts',
];

const RAW_PALETTE_REGEX = /\b(bg|text|border|ring|divide|from|via|to|placeholder|accent)-(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}(\/[0-9]+)?\b/g;
const RAW_STANDALONE_REGEX = /\b(bg|text|border|ring|divide)-(white|black)(\/[0-9]+)?\b/g;
const ARBITRARY_COLOR_REGEX = /\b(bg|text|border|ring|divide|from|via|to|placeholder|accent|shadow)-\[#[0-9a-fA-F]{3,8}\]/g;
const RAW_HEX_REGEX = /#[0-9a-fA-F]{3,8}\b/g;

const rootDir = path.resolve(__dirname, '../src');

let errors = [];

function checkFile(filePath) {
  const fileName = path.basename(filePath);
  if (ALLOWED_FILES.some(allowed => fileName.endsWith(allowed))) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check arbitrary color classes
    let match;
    while ((match = ARBITRARY_COLOR_REGEX.exec(line)) !== null) {
      errors.push({
        file: path.relative(path.resolve(__dirname, '..'), filePath),
        line: lineNum,
        match: match[0],
        type: 'Arbitrary Tailwind color class'
      });
    }

    // Check raw palette classes
    while ((match = RAW_PALETTE_REGEX.exec(line)) !== null) {
      errors.push({
        file: path.relative(path.resolve(__dirname, '..'), filePath),
        line: lineNum,
        match: match[0],
        type: 'Tailwind raw palette class'
      });
    }

    // Check standalone white/black classes
    while ((match = RAW_STANDALONE_REGEX.exec(line)) !== null) {
      errors.push({
        file: path.relative(path.resolve(__dirname, '..'), filePath),
        line: lineNum,
        match: match[0],
        type: 'Tailwind standalone white/black class'
      });
    }
  });
}

function traverse(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      traverse(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css'))) {
      checkFile(fullPath);
    }
  }
}

traverse(rootDir);

if (errors.length > 0) {
  console.error(`\x1b[31m[COLOR GUARD] Found ${errors.length} unmigrated raw color instances:\x1b[0m\n`);
  errors.slice(0, 50).forEach(err => {
    console.error(`  ${err.file}:${err.line} - [${err.type}]: \x1b[33m${err.match}\x1b[0m`);
  });
  if (errors.length > 50) {
    console.error(`\n... and ${errors.length - 50} more.`);
  }
  process.exit(1);
} else {
  console.log('\x1b[32m[COLOR GUARD] PASS: All colors strictly conform to semantic tokens! 0 raw colors found.\x1b[0m');
  process.exit(0);
}
