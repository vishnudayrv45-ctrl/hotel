import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import menuRoutes from './routes/menu.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import reservationsRoutes from './routes/reservations.routes.js'
import messagesRoutes from './routes/messages.routes.js'
import authRoutes from './routes/auth.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { seedMenuIfEmpty } from './data/seed/seedMenu.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json({ limit: '100kb' }))

// uploaded dish photos are served from /uploads
const uploadsDir = path.join(__dirname, 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

app.use('/api/menu', menuRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/reservations', reservationsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/admin', authRoutes)
app.use('/api/upload', uploadRoutes)

app.use(notFound)
app.use(errorHandler)

seedMenuIfEmpty()

app.listen(PORT, () => {
  console.log(`Aurum server running at http://localhost:${PORT}`)
})