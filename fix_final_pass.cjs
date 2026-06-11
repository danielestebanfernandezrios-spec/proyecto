const fs = require('fs');
const file = 'index.html';
let text = fs.readFileSync(file, 'utf8');
const replacements = [
  ['SimulaciÒ³n', 'Simulación'],
  ['PaÒ­s', 'País'],
  ['MÒ©xico', 'México'],
  ['ðŸ⬡¨ðŸ⬡´', '🇨🇴'],
  ['ðŸ⬡²ðŸ⬡½', '🇲🇽'],
  ['â�', '✕'],
  ['ðŸ⬝', '📋'],
  ['ðŸ�S', '📊'],
  ['ðŸ�º', '🏛️'],
  ['ðŸ⬡', '🇦']
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
  console.log('fixed', updated, 'broken sequences');
}
