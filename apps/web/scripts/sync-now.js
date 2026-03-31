import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Cargar variables de .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const env = fs.readFileSync(envPath, 'utf8')

env.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  }
})

const url = process.env.VERCEL_DEPLOY_HOOK_NOW

if (!url) {
  console.error('❌ VERCEL_DEPLOY_HOOK_NOW no encontrado en .env.local')
  process.exit(1)
}

// Ejecutar deploy hook
fetch(url, { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('✅ Deploy disparado:', data))
  .catch(err => console.error('❌ Error:', err.message))
