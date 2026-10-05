const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '..', 'src'));
let count = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('Jubilee') || content.includes('jubilee')) {
    const updated = content
      .replace(/Jubilee/g, 'Ophir')
      .replace(/jubilee/g, 'ophir');
    fs.writeFileSync(file, updated, 'utf8');
    count++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished updating ${count} files.`);
