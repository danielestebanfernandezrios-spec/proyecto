const fs = require('fs');
const file = 'index.html';
let text = fs.readFileSync(file, 'utf8');
const replacements = [
  ['âš ï¸', '⚠️'],
  ['âš��ï¸', '⚙️']
];
let updated = 0;
for (const [from, to] of replacements) {
  while (text.indexOf(from) >= 0) {
    text = text.split(from).join(to);
    updated++;
  }
}
if (updated) {
  fs.writeFileSync(file, text, 'utf8');
  console.log('cleaned up', updated, 'sequences');
}
