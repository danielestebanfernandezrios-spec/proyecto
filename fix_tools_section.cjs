const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Arreglar botones de herramientas
content = content.replace(/Ver estadísticas<\/button>/g, '📊 Ver estadísticas</button>');
content = content.replace(/Ver zonas seguras<\/button>/g, '📍 Ver zonas seguras</button>');
content = content.replace(/Configuración<\/button>/g, '⚙️ Configuración</button>');

// Arreglar modales
content = content.replace(/<h2>.*?Estadísticas<\/h2>/g, '<h2>📊 Estadísticas</h2>');
content = content.replace(/<h2>.*?Zonas Seguras<\/h2>/g, '<h2>📍 Zonas Seguras</h2>');
content = content.replace(/<h2>.*?Modo Simulación<\/h2>/g, '<h2>⚙️ Modo Simulación</h2>');
content = content.replace(/<h2>.*?Configuración<\/h2>/g, '<h2>⚙️ Configuración</h2>');
content = content.replace(/<h2>.*?Crear cuenta<\/h2>/g, '<h2>✍️ Crear cuenta</h2>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Archivo arreglado exitosamente');
