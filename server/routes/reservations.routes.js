import { Router } from 'express'
import { read, write, uid } from '../data/db/store.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const STATUSES = ['Pending', 'Confirmed', 'Cancelled']

// PUBLIC: book a table. Body: { name, date, time, guests, occasion }
router.post('/', (req, res) => {
  const { name = '', date = '', time = '', guests, occasion = '' } = req.body || {}
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD

  if (String(name).trim().length < 2) return res.status(400).json({ error: 'Please enter your name' })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Please choose a date' })
  if (date < today) return res.status(400).json({ error: 'Please choose today or a future date' })
  if (!String(time).trim()) return res.status(400).json({ error: 'Please choose a time' })
  const g = Math.floor(Number(guests))
  if (!(g >= 1 && g <= 12)) return res.status(400).json({ error: 'Guests must be between 1 and 12' })

  const booking = {
    id: uid('AUR-'),
    name: String(name).trim().slice(0, 60),
    date,
    time: String(time).slice(0, 20),
    guests: g,
    occasion: String(occasion).slice(0, 40),
    status: 'Pending',
  }
  const list = read('reservations')
  list.unshift(booking)
  write('reservations', list)
  res.status(201).json(booking)
})

// ADMIN: list
router.get('/', adminAuth, (req, res) => res.json(read('reservations')))

// ADMIN: change status
router.patch('/:id/status', adminAuth, (req, res) => {
  const { status } = req.body || {}
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  const list = read('reservations')
  const r = list.find((x) => x.id === req.params.id)
  if (!r) return res.status(404).json({ error: 'Reservation not found' })
  r.status = status
  write('reservations', list)
  res.json(r)
})

// ADMIN: delete
router.delete('/:id', adminAuth, (req, res) => {
  const list = read('reservations')
  const next = list.filter((x) => x.id !== req.params.id)
  if (next.length === list.length) return res.status(404).json({ error: 'Reservation not found' })
  write('reservations', next)
  res.json({ ok: true })
})

export default router