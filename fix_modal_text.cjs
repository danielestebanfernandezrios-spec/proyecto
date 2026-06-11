const fs = require('fs');
const file = 'index.html';
let text = fs.readFileSync(file, 'utf8');
const replacements = [
  ['âš��ï¸ Herramientas', '⚙️ Herramientas'],
  ['ðŸ�ºï¸ Ver zonas seguras', '🏛️ Ver zonas seguras'],
  ['âš��ï¸ Configuración', '⚙️ Configuración'],
  ['âš��ï¸ Modo Simulación', '⚙️ Modo Simulación'],
  ['PerÒº', 'Perú'],
  ['EspaÒ±a', 'España'],
  ['TelÒ©fono local', 'Teléfono local'],
  ['cÒ³digo de verificaciÒ³n', 'código de verificación'],
  ['VerificaciÒ³n humana', 'Verificación humana'],
  ['CÒ³digo de verificaciÒ³n', 'Código de verificación'],
  ['RecibirÒ¡s un cÒ³digo SMS', 'Recibirás un código SMS'],
  ['verificar tu nÒºmero', 'verificar tu número'],
  ['cÒ³digo fijo', 'código fijo'],
  ['PÒ¡nico Modal', 'Pánico Modal'],
  ['Abre las zonas seguras para solicitar permiso de ubicaciÒ³n', 'Abre las zonas seguras para solicitar permiso de ubicación'],
  ['TelÒ©fono:', 'Teléfono:'],
  ['SesiÒ³n:', 'Sesión:'],
  ['ðŸ�"¾ Guardar', '💾 Guardar'],
  ['ðŸ�ºï¸ Zonas Seguras', '🏛️ Zonas Seguras'],
  ['Parque del RÒ­o', 'Parque del Río'],
  ['Òrea peatonal segura junto al Río Cali', 'Área peatonal segura junto al Río Cali'],
  ['acceso rÒ¡pido desde el río', 'acceso rápido desde el río'],
  ['Punto de reuniÒ³n seguro', 'Punto de reunión seguro'],
  ['JardÒ­n BotÒ¡nico de Cali', 'Jardín Botánico de Cali'],
  ['🇦µ🇦ª', '🇵🇪'],
  ['🇦ª🇦¸', '🇪🇸'],
  ['ðŸ⬡', ''],
  ['ðŸ⬝', ''],
  ['ðŸ', '']
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
  console.log('cleaned', updated, 'items');
}
