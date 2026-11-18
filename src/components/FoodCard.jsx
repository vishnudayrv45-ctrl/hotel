import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function FoodCard({ item, index, onOpen, onAdd }) {
  const ref = useRef()
  const [imgOk, setImgOk] = useState(true)
  const showPhoto = item.image && imgOk

  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    const s = ref.current.style
    s.setProperty('--rx', `${(0.5 - y) * 12}deg`)
    s.setProperty('--ry', `${(x - 0.5) * 16}deg`)
    s.setProperty('--mx', `${x * 100}%`)
    s.setProperty('--my', `${y * 100}%`)
  }
  const leave = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 70, rotateX: -18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className="card-wrap"
    >
      <div
        ref={ref}
        className="card"
        style={{ '--glow': item.accent }}
        onMouseMove={move}
        onMouseLeave={leave}
        onClick={() => onOpen(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
        aria-label={`Open ${item.name}`}
      >
        <div className="card-top">
          <span className="chip">{item.cat}</span>
          {item.veg && <span className="chip leaf">Veg</span>}
        </div>

        {showPhoto ? (
          <div className="card-photo">
            <img src={item.image} alt={item.name} loading="lazy" onError={() => setImgOk(false)} />
          </div>
        ) : (
          <div className="card-photo ph">
            <span className="ph-emoji">{item.emoji}</span>
            <small>Photo coming soon</small>
          </div>
        )}

        <div className="card-body">
          <h3>{item.name}</h3>
          <p>{item.tagline}</p>
          <div className="card-foot">
            <strong>₹{item.price}</strong>
            <div className="card-actions">
              <button className="mini" onClick={(e) => { e.stopPropagation(); onAdd(item, 1) }} aria-label={`Add ${item.name}`}>+ Add</button>
              <span className="view3d">View dish →</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}