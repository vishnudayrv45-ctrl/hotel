import { Router } from 'express'
import { read, write, uid } from '../data/db/store.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()

const KIND = { Burgers: 'burger', Pizzas: 'pizza', Biryani: 'biryani', Pasta: 'pasta', Desserts: 'dessert', Beverages: 'beverage' }
const TONE = { burger: '#f2b53d', pizza: '#c0392b', biryani: '#f3dfa6', pasta: '#f1d27a', dessert: '#2a140c', beverage: '#f4a640' }
const EMOJI = { Burgers: '🍔', Pizzas: '🍕', Biryani: '🍛', Pasta: '🍝', Desserts: '🍰', Beverages: '🍹' }

function validate(b) {
  if (!b || typeof b.name !== 'string' || b.name.trim().length < 2) return 'Dish name is required'
  if (!KIND[b.cat]) return 'Choose a valid category'
  if (!(Number(b.price) > 0)) return 'Price must be above 0'
  return null
}

// PUBLIC: list all dishes
router.get('/', (req, res) => {
  res.json(read('menu'))
})

// ADMIN: add a dish
router.post('/', adminAuth, (req, res) => {
  const b = req.body
  const error = validate(b)
  if (error) return res.status(400).json({ error })

  const kind = KIND[b.cat]
  const item = {
    id: uid('item-').toLowerCase(),
    name: b.name.trim(),
    cat: b.cat,
    kind,
    tone: b.tone || TONE[kind],
    accent: b.accent || '#d9a548',
    emoji: EMOJI[b.cat],
    price: Number(b.price),
    tagline: b.tagline || '',
    desc: b.desc || '',
    ingredients: Array.isArray(b.ingredients) ? b.ingredients : [],
    image: b.image || '',
    veg: !!b.veg,
    spice: Number(b.spice) || 0,
    cal: Number(b.cal) || 0,
    time: b.time || '15 min',
  }
  const menu = read('menu')
  menu.push(item)
  write('menu', menu)
  res.status(201).json(item)
})

// ADMIN: edit a dish
router.put('/:id', adminAuth, (req, res) => {
  const menu = read('menu')
  const i = menu.findIndex((m) => m.id === req.params.id)
  if (i === -1) return res.status(404).json({ error: 'Dish not found' })

  const merged = { ...menu[i], ...req.body, id: menu[i].id }
  const error = validate(merged)
  if (error) return res.status(400).json({ error })

  merged.price = Number(merged.price)
  merged.spice = Number(merged.spice) || 0
  merged.cal = Number(merged.cal) || 0
  merged.kind = KIND[merged.cat]
  merged.emoji = EMOJI[merged.cat]
  if (menu[i].cat !== merged.cat && !req.body.tone) merged.tone = TONE[merged.kind]

  menu[i] = merged
  write('menu', menu)
  res.json(merged)
})

// ADMIN: delete a dish
router.delete('/:id', adminAuth, (req, res) => {
  const menu = read('menu')
  const next = menu.filter((m) => m.id !== req.params.id)
  if (next.length === menu.length) return res.status(404).json({ error: 'Dish not found' })
  write('menu', next)
  res.json({ ok: true })
})

export default router