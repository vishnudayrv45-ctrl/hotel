import { Router } from 'express'
import crypto from 'node:crypto'
import { sessions, getToken } from '../middleware/adminAuth.js'

const router = Router()
const PIN = process.env.ADMIN_PIN || '1234' // demo PIN

router.post('/login', (req, res) => {
  if (String(req.body?.pin) !== PIN) return res.status(401).json({ error: 'Wrong PIN' })
  const token = crypto.randomUUID()
  sessions.add(token)
  res.json({ token })
})

router.post('/logout', (req, res) => {
  sessions.delete(getToken(req))
  res.json({ ok: true })
})

export default router