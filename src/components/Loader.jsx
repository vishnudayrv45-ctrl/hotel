import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Loader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])
  const ease = [0.76, 0, 0.24, 1]
  return (
    <motion.div className="loader" exit={{ transition: { duration: 1.2 } }}>
      <motion.div className="curtain top" exit={{ y: '-100%' }} transition={{ duration: 1.1, ease }} />
      <motion.div className="curtain bot" exit={{ y: '100%' }} transition={{ duration: 1.1, ease }} />
      <motion.div className="loader-mid" exit={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.5 }}>
        <motion.div className="loader-logo" initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={{ opacity: 1, letterSpacing: '0.55em' }} transition={{ duration: 2, ease: 'easeOut' }}>
          AURUM
        </motion.div>
        <div className="loader-bar"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.3, ease: 'easeInOut' }} /></div>
        <p>Lighting the fires…</p>
      </motion.div>
    </motion.div>
  )
}