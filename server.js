import { spawn } from 'child_process'
import open from 'open'

const PORT = 5173

console.log('🌊 Iniciando servidor SATD con Vite...\n')

const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
})

setTimeout(async () => {
  try {
    await open(`http://localhost:${PORT}`)
    console.log(`✓ Navegador abierto en http://localhost:${PORT}\n`)
  } catch (err) {
    console.log(`⚠ Abre manualmente: http://localhost:${PORT}\n`)
  }
}, 2000)

viteProcess.on('close', code => {
  console.log(`\nServidor cerrado (código: ${code})`)
  process.exit(code)
})
