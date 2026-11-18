// tokens of currently logged-in admins (cleared when the server restarts)
export const sessions = new Set()

export function getToken(req) {
  const h = req.headers.authorization || ''
  return h.startsWith('Bearer ') ? h.slice(7) : ''
}

export function adminAuth(req, res, next) {
  if (!sessions.has(getToken(req))) {
    return res.status(401).json({ error: 'Admin login required' })
  }
  next()
}