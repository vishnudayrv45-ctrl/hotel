import { View } from '@react-three/drei'
import { byId } from '../data/menu'
import { FoodView } from '../three/Stage'
import Words from './Words'

const PICKS = [
  { id: 'royal-biryani', no: '01', note: 'Sealed in dough. Opened at your table.' },
  { id: 'truffle-burger', no: '02', note: 'The burger that built our reputation.' },
  { id: 'molten-lava', no: '03', note: 'Break it open. Watch it flow.' },
]

export default function Signature({ onOpen, onAdd }) {
  return (
    <section id="signature" className="section signature">
      <div className="section-head">
        <span className="eyebrow" data-reveal>Signature Dishes</span>
        <Words text="Three plates. One obsession." />
      </div>
      {PICKS.map((p, i) => {
        const item = byId(p.id)
        return (
          <article className={`sig ${i % 2 ? 'rev' : ''}`} key={p.id} style={{ '--glow': item.accent }}>
            <div className="sig-no" data-speed="0.6">{p.no}</div>
            <View className="sig-view"><FoodView item={item} float big hovered /></View>
            <div className="sig-text">
              <span className="eyebrow" data-reveal>{item.cat}</span>
              <Words as="h3" text={item.name} />
              <p data-reveal className="lead">{p.note}</p>
              <p data-reveal>{item.desc}</p>
              <div className="sig-actions" data-reveal>
                <strong>₹{item.price}</strong>
                <button className="btn gold" onClick={() => onOpen(item)}><span>Experience in 3D</span></button>
                <button className="btn ghost" onClick={() => onAdd(item, 1)}><span>Add to order</span></button>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}