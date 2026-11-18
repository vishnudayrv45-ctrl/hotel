import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { adminAuth } from '../middleware/adminAuth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()
const ALLOWED = ['.jpg', '.jpeg', '.png', '.webp']

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase()
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`)
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED.includes(ext)) cb(null, true)
    else cb(new Error('Only JPG, PNG or WEBP photos are allowed'))
  },
})

// ADMIN: upload one photo (form field name: "photo") -> { url }
router.post('/', adminAuth, upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No photo received' })
  res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

export default router