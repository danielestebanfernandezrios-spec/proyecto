const fs = require('fs');
const file = 'index.html';
let text = fs.readFileSync(file, 'utf8');
const replacements = [
  ['ðŸ�SŠ Monitoreo en Tiempo Real', '📊 Monitoreo en Tiempo Real'],
  ['<!-- Nivel del RÒ­o -->', '<!-- Nivel del Río -->'],
  ['RÒ­o Cali', 'Río Cali'],
  ['PreparaciÒ³n preventiva y seguimiento constante', 'Preparación preventiva y seguimiento constante'],
  ['BotÒ³n de Emergencia', 'Botón de Emergencia'],
  ['BotÒ³n de pÒ¡nico', 'Botón de pánico'],
  ['AdministraciÒ³n', 'Administración'],
  ['âš�\u001e�ï¸ SimulaciÒ³n', '⚙️ Simulación'],
  ['Sin alertas aÒºn', 'Sin alertas aún'],
  ['Alerta Amarilla â�\u001a��S PreparaciÒ³n', 'Alerta Amarilla — Preparación'],
  ['Alerta Naranja â�\u001a��S Alistamiento para Evacuar', 'Alerta Naranja — Alistamiento para Evacuar'],
  ['Alerta Roja â�\u001a��S EvacuaciÒ³n Inmediata', 'Alerta Roja — Evacuación Inmediata'],
  ['El nivel del rÒ­o ha comenzado a aumentar', 'El nivel del río ha comenzado a aumentar'],
  ['situaciÒ³n evolucione a un riesgo mayor', 'situación evolucione a un riesgo mayor'],
  ['prevenciÒ³n.', 'prevención.'],
  ['El nivel del rÒ­o estÒ¡ cerca de un punto crÒ­tico', 'El nivel del río está cerca de un punto crítico'],
  ['Transmisi�n simulada', 'Transmisión simulada'],
  ['Transmisi�n en vivo simulada del R�o', 'Transmisión en vivo simulada del Río'],
  ['R�o Cali - C�mara en vivo', 'Río Cali - Cámara en vivo'],
  ['Transmisi�n simulada del r�o en tiempo real.', 'Transmisión simulada del río en tiempo real.'],
  ['Refrescar transmisi�n', 'Refrescar transmisión'],
  ['Río 24/7   Transmisión simulada', '🌊 Río 24/7 • Transmisión simulada'],
  ['Transmisión simulada del r�o en tiempo real.', 'Transmisión simulada del río en tiempo real.'],
  ['ExplicaciÒ³n', 'Explicación'],
  ['simulaciÒ³n', 'simulación'],
  ['ðŸš¨', '🚨'],
  ['ðŸŸ¡', '🟡'],
  ['ðŸŸ ', '🟠'],
  ['ðŸ⬝´', '🔴'],
  ['ðŸ�S° Lo reporto yo', '📝 Lo reporto yo'],
  ['ðŸ�S°', '📝'],
  ['C�mara', 'Cámara'],
  ['R�o', 'Río'],
  ['r�o', 'río']
];
let updated = 0;
for (const [from, to] of replacements) {
  if (text.indexOf(from) >= 0) {
    text = text.split(from).join(to);
    updated++;
    console.log('replaced', from);
  }
}
if (updated) {
  fs.writeFileSync(file, text, 'utf8');
  console.log('updated', updated, 'entries');
} else {
  console.log('no replacements applied');
}
