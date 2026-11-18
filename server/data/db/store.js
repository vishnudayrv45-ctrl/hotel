import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')

const file = (name) => path.join(DATA_DIR, `${name}.json`)

// read("menu") -> array from data/menu.json (empty array if missing)
export function read(name) {
  try {
    return JSON.parse(fs.readFileSync(file(name), 'utf8'))
  } catch {
    return []
  }
}

// write("menu", array) -> saves data/menu.json
export function write(name, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(file(name), JSON.stringify(data, null, 2))
}

export const uid = (prefix) => prefix + Math.random().toString(36).slice(2, 7).toUpperCase()
export const nowText = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })