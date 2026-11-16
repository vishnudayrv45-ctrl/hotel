import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, MENU } from '../data/menu'
import FoodCard from './FoodCard'
import Words from './Words'

export default function Menu({ onOpen, onAdd }) {
  const [cat, setCat] = useState('All')
  const [veg, setVeg] = useState(false)
  const items = MENU.filter((m) => (cat === 'All' || m.cat === cat) && (!veg || m.veg))
  return (
    <section id="menu" className="section menu">
      <div className="section-head">
        <span className="eyebrow" data-reveal>The Menu</span>
        <Words text="Taste it with your eyes first." />
        <p className="lead" data-reveal>Tap any dish to pull it into 3D — spin it, zoom in, and meet your meal before it arrives.</p>
      </div>

      <div className="tabs" data-reveal>
        {CATEGORIES.map((c) => (
          <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>
            {cat === c && <motion.i layoutId="tab-pill" className="pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span>{c}</span>
          </button>
        ))}
        <label className="toggle">
          <input type="checkbox" checked={veg} onChange={(e) => setVeg(e.target.checked)} />
          <i /> Veg only
        </label>
      </div>

      <div className="grid">
        <AnimatePresence mode="popLayout">
          {items.map((it, i) => <FoodCard key={it.id} item={it} index={i} onOpen={onOpen} onAdd={onAdd} />)}
        </AnimatePresence>
        {items.length === 0 && <p className="empty">Nothing here yet — try another filter.</p>}
      </div>
    </section>
  )
}