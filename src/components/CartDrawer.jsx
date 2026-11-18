import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function CartDrawer({ open, lines, subtotal, onClose, onQty, onRemove, onPlace }) {
  const [name, setName] = useState('')
  const gst = Math.round(subtotal * 0.05)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="drawer" data-lenis-prevent initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <header>
              <h3>Your order</h3>
              <button onClick={onClose} aria-label="Close">✕</button>
            </header>

            {lines.length === 0 ? (
              <p className="empty">Your table is waiting. Add something delicious.</p>
            ) : (
              <>
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map(({ item, qty }) => (
                      <motion.li key={item.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }}>
                        <span className="em">{item.emoji}</span>
                        <div>
                          <b>{item.name}</b>
                          <small>₹{item.price} × {qty} = ₹{item.price * qty}</small>
                        </div>
                        <div className="stepper sm">
                          <button onClick={() => onQty(item.id, qty - 1)} aria-label="Less">−</button>
                          <span>{qty}</span>
                          <button onClick={() => onQty(item.id, qty + 1)} aria-label="More">+</button>
                        </div>
                        <button className="remove" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>✕</button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="totals">
                  <div><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div><span>GST (5%)</span><span>₹{gst}</span></div>
                  <div className="grand"><span>Total</span><span>₹{subtotal + gst}</span></div>
                </div>

                <label className="cart-name">Name for the order
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </label>
                <button className="btn gold big wide" onClick={() => { onPlace(name); setName('') }}>
                  <span>Place order</span>
                </button>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}