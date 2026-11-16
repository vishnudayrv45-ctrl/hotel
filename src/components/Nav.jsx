import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { scrollToId } from '../lib/smooth'

const LINKS = [['menu', 'Menu'], ['story', 'Story'], ['signature', 'Signature'], ['gallery', 'Gallery'], ['reserve', 'Reserve']]

export function Logo() {
  return (
    <div className="logo" onClick={() => scrollToId('top')}>
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="11" />
        <path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 3-6 .5 2 1.5 3 2.5 3 0-3-1-5.500.5-8z" fill="currentColor" fillOpacity=".25" />
      </svg>
      <span><b>AURUM</b><small>Fire &amp; Spice Kitchen</small></span>
    </div>
  )
}

export default function Nav({ count, onCart }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 60)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  const go = (id) => {
    setOpen(false)
    setTimeout(() => scrollToId(id), open ? 450 : 0)
  }
  return (
    <>
      <motion.header className={`nav ${solid ? 'solid' : ''}`} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 3, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}>
        <Logo />
        <nav className="nav-links">
          {LINKS.map(([id, l]) => <button key={id} onClick={() => go(id)}>{l}</button>)}
        </nav>
        <div className="nav-right">
          <button className="cart-btn" onClick={onCart} aria-label="Open order">
            Order <span key={count} className="badge">{count}</span>
          </button>
          <button className={`burger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu"><i /><i /></button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            {LINKS.map(([id, l], i) => (
              <motion.button key={id} onClick={() => go(id)} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07 }}>{l}</motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}