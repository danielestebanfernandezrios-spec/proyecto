const fs = require('fs');
const file = 'index.html';
let text = fs.readFileSync(file, 'utf8');
const replacements = [
  ['Ò¡', 'á'],
  ['Òº', 'u'],
  ['Ò­', 'í'],
  ['CÒ¡mara', 'Cámara'],
  ['Preparar evacuaciÒ³n inmediata', 'Preparación para evacuación inmediata'],
  ['aÒºn', 'aún'],
  ['mÒ¡xima', 'máxima'],
  ['Ò©', 'é'],
  ['Ò±', 'ñ'],
  ['Ò³', 'ó'],
  ['envÒ³', 'envió']
];
let updated = 0;
for (const [from, to] of replacements) {
  if (text.indexOf(from) >= 0) {
    text = text.split(from).join(to);
    updated++;
  }
}
if (updated) {
  fs.writeFileSync(file, text, 'utf8');
  console.log('fixed', updated, 'remaining encoding issues');
}
