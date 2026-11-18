export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Photo is too large (max 3 MB)' })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON sent' })
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' })
}