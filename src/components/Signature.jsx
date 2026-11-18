import Words from './Words'
import { useStore } from '../context/StoreContext'

const DEFAULT_PICKS = [
  { id: 'royal-biryani', no: '01', note: 'Sealed in dough. Opened at your table.' },
  { id: 'truffle-burger', no: '02', note: 'The burger that built our reputation.' },
  { id: 'molten-lava', no: '03', note: 'Break it open. Watch it flow.' },
]

export default function Signature({ onOpen, onAdd }) {
  const { getDish, menu } = useStore()

  const picks = DEFAULT_PICKS.map((p, idx) => {
    let item = getDish(p.id)
    if (!item && menu.length > idx) item = menu[idx]
    return item ? { ...p, item } : null
  }).filter(Boolean)

  if (picks.length === 0) return null

  return (
    <section id="signature" className="section signature">
      <div className="section-head">
        <span className="eyebrow" data-reveal>Signature Dishes</span>
        <Words text="Three plates. One obsession." />
      </div>

      {picks.map(({ no, note, item }, i) => (
        <article
          className={`sig ${i % 2 ? 'rev' : ''}`}
          key={item.id}
          style={{ '--glow': item.accent || '#d9a548' }}
        >
          <div className="sig-no" data-speed="0.6">{no}</div>

          {item.image ? (
            <div className="sig-photo">
              <img src={item.image} alt={item.name} loading="lazy" />
            </div>
          ) : (
            <div className="sig-photo sig-ph">
              <span className="ph-emoji">{item.emoji}</span>
              <small>Photo coming soon</small>
            </div>
          )}

          <div className="sig-text">
            <span className="eyebrow" data-reveal>{item.cat}</span>
            <Words as="h3" text={item.name} />
            <p data-reveal className="lead">{note}</p>
            <p data-reveal>{item.desc}</p>
            <div className="sig-actions" data-reveal>
              <strong>₹{item.price}</strong>
              <button className="btn gold" onClick={() => onOpen(item)}><span>View dish</span></button>
              <button className="btn ghost" onClick={() => onAdd(item, 1)}><span>Add to order</span></button>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}