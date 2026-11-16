import { AnimatePresence, motion } from 'framer-motion'
import { byId } from '../data/menu'

export default function CartDrawer({ open, cart, onClose, onQty, onPlace }) {
  const lines = Object.entries(cart).map(([id, q]) => ({ item: byId(id), q }))
  const sub = lines.reduce((s, l) => s + l.item.price * l.q, 0)
  const gst = Math.round(sub * 0.05)
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="drawer" data-lenis-prevent initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <header><h3>Your order</h3><button onClick={onClose} aria-label="Close">✕</button></header>
            {lines.length === 0 ? (
              <p className="empty">Your table is waiting. Add something delicious.</p>
            ) : (
              <>
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map(({ item, q }) => (
                      <motion.li key={item.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }}>
                        <span className="em">{item.emoji}</span>
                        <div><b>{item.name}</b><small>₹{item.price}</small></div>
                        <div className="stepper sm">
                          <button onClick={() => onQty(item.id, q - 1)}>−</button><span>{q}</span><button onClick={() => onQty(item.id, q + 1)}>+</button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="totals">
                  <div><span>Subtotal</span><span>₹{sub}</span></div>
                  <div><span>GST (5%)</span><span>₹{gst}</span></div>
                  <div className="grand"><span>Total</span><span>₹{sub + gst}</span></div>
                </div>
                <button className="btn gold big wide" onClick={onPlace}><span>Place order</span></button>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}