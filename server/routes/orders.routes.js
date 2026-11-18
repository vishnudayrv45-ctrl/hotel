import { Router } from 'express'
import { read, write, uid, nowText } from '../data/db/store.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const STATUSES = ['New', 'Preparing', 'Served', 'Cancelled']

// PUBLIC: place an order. Body: { customer, items: [{ id, qty }] }
// Prices are taken from the menu on the server, not from the browser.
router.post('/', (req, res) => {
  const { customer = '', items } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your order is empty' })
  }

  const menu = read('menu')
  const lines = []
  for (const it of items) {
    const dish = menu.find((m) => m.id === it.id)
    const qty = Math.min(50, Math.max(1, Math.floor(Number(it.qty) || 0)))
    if (dish && qty > 0) lines.push({ name: dish.name, qty, price: dish.price })
  }
  if (lines.length === 0) return res.status(400).json({ error: 'No valid dishes in the order' })

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const gst = Math.round(subtotal * 0.05)
  const order = {
    id: uid('ORD-'),
    customer: String(customer).trim().slice(0, 60) || 'Guest',
    date: nowText(),
    items: lines,
    subtotal,
    gst,
    total: subtotal + gst,
    status: 'New',
  }

  const orders = read('orders')
  orders.unshift(order)
  write('orders', orders)
  res.status(201).json(order)
})

// ADMIN: list orders
router.get('/', adminAuth, (req, res) => res.json(read('orders')))

// ADMIN: change status. Body: { status }
router.patch('/:id/status', adminAuth, (req, res) => {
  const { status } = req.body || {}
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  const orders = read('orders')
  const order = orders.find((o) => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  order.status = status
  write('orders', orders)
  res.json(order)
})

// ADMIN: delete order
router.delete('/:id', adminAuth, (req, res) => {
  const orders = read('orders')
  const next = orders.filter((o) => o.id !== req.params.id)
  if (next.length === orders.length) return res.status(404).json({ error: 'Order not found' })
  write('orders', next)
  res.json({ ok: true })
})

export default router