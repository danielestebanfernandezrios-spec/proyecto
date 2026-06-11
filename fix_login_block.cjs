const fs = require('fs');
const p = 'c:/Users/danie/Desktop/satd/index.html';
let s = fs.readFileSync(p, 'utf8');
const startToken = '<div class="form-group">\n          <label>Contrase';
const start = s.indexOf(startToken);
if (start === -1) {
  console.error('start token not found');
  process.exit(1);
}
const endToken = '<div class="info-box">';
const end = s.indexOf(endToken, start);
if (end === -1) {
  console.error('end token not found');
  process.exit(1);
}
const prefix = s.slice(0, start);
const suffix = s.slice(end);
const replacement = `      <div class="form-group">\n        <label>Contraseña</label>\n        <input type="password" id="password" placeholder="Tu número completo" onkeypress="if(event.key==='Enter') login()">\n      </div>\n\n      <button class="login-btn" onclick="login()">🔓 Ingresar</button>\n\n      <div class="btn-group" style="grid-template-columns: 1fr; margin-top: 20px; gap: 12px;">\n        <button class="btn-secondary" onclick="guestLogin()">👤 Entrar como invitado</button>\n        <button class="btn-secondary" onclick="openModal('registerModal')">✍️ Crear cuenta</button>\n      </div>\n\n`;
fs.writeFileSync(p, prefix + replacement + suffix, 'utf8');
console.log('login block repaired');
