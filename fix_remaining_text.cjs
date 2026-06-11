const fs = require('fs');
const file = 'index.html';
let text = fs.readFileSync(file, 'utf8');
const replacements = [
  ['DescripciÒ³n', 'Descripción'],
  ['rÒ­o', 'río'],
  ['ðŸ�S¤ Publicar reporte', '📣 Publicar reporte'],
  ['Publica solo informaciÒ³n relacionada con el rÒ­o Cali.', 'Publica solo información relacionada con el río Cali.'],
  ['âš��ï¸ Herramientas', '⚙️ Herramientas'],
  ['ðŸ⬝ Ver EstadÒ­sticas', '📈 Ver Estadísticas'],
  ['histÒ³ricos', 'históricos'],
  ['estadÒ­sticas', 'estadísticas'],
  ['ðŸ�S�  Ver estadÒ­sticas', '📊 Ver estadísticas'],
  ['ðŸ�S Zonas Seguras', '🏠 Zonas Seguras'],
  ['mÒ¡s', 'más'],
  ['ðŸ�ºï¸ Ver zonas seguras', '🏘️ Ver zonas seguras'],
  ['ðŸ�S⬹ ConfiguraciÒ³n', '⚙️ Configuración'],
  ['âš��ï¸ ConfiguraciÒ³n', '⚙️ Configuración'],
  ['â�⬢', '✕'],
  ['SimulaciÒ³n Modal', 'Simulación Modal'],
  ['âš��ï¸ Modo SimulaciÒ³n', '⚙️ Modo Simulación'],
  ['permite que el nivel del rÒ­o cambie automÒ¡ticamente', 'permite que el nivel del río cambie automáticamente'],
  ['â�¶ï¸ Activar/Desactivar', '▶️ Activar/Desactivar'],
  ['automÒ¡ticamente', 'automáticamente'],
  ['EstadÒ­sticas', 'Estadísticas'],
  ['ConfiguraciÒ³n', 'Configuración'],
  ['informaciÒ³n', 'información']
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
  console.log('fixed', updated, 'patterns');
}
