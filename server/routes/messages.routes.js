import { Router } from 'express'
import { read, write, uid, nowText } from '../data/db/store.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()

// PUBLIC: contact form. Body: { name, email, message, phone?, subject? }
router.post('/', (req, res) => {
  const { name = '', email = '', message = '', phone = '', subject = '' } = req.body || {}
  if (String(name).trim().length < 2) return res.status(400).json({ error: 'Please enter your name' })
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email' })
  if (String(message).trim().length < 10) return res.status(400).json({ error: 'Message should be at least 10 characters' })

  const msg = {
    id: uid('MSG-'),
    name: String(name).trim().slice(0, 60),
    email: String(email).trim().slice(0, 100),
    phone: String(phone).trim().slice(0, 30),
    subject: String(subject).trim().slice(0, 80),
    message: String(message).trim().slice(0, 1000),
    date: nowText(),
  }
  const list = read('messages')
  list.unshift(msg)
  write('messages', list)
  res.status(201).json({ ok: true })
})

// ADMIN: list
router.get('/', adminAuth, (req, res) => res.json(read('messages')))
    


// ADMIN: delete
router.delete('/:id', adminAuth, (req, res) => {
  const list = read('messages')
  const next = list.filter((m) => m.id !== req.params.id)
  if (next.length === list.length) return res.status(404).json({ error: 'Message not found' })
  write('messages', next)
  res.json({ ok: true })
})

export default router