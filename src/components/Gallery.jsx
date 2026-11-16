import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import Photo from './Photo'

const SHOTS = [
  ['gallery-1.jpg', 'The Open Hearth', 'a'],
  ['gallery-2.jpg', 'Brass & Ember Bar', 'b'],
  ['gallery-3.jpg', 'Private Dining', 'c'],
  ['gallery-4.jpg', 'Plated Gold', 'a'],
  ['gallery-5.jpg', 'The Chef’s Counter', 'b'],
  ['gallery-6.jpg', 'Candlelit Terrace', 'c'],
]

export default function Gallery() {
  const sec = useRef()
  const track = useRef()
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => track.current.scrollWidth - window.innerWidth + 120
      gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: sec.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
      })
    })
    return () => mm.revert()
  }, [])
  return (
    <section id="gallery" className="gallery" ref={sec}>
      <div className="gallery-track" ref={track}>
        <div className="gallery-intro">
          <span className="eyebrow">The Room</span>
          <h2>Step inside the glow.</h2>
          <p>Keep scrolling — the room moves with you.</p>
        </div>
        {SHOTS.map(([f, t, tone], i) => (
          <figure className={`shot s${i % 3}`} key={f}>
            <Photo src={`/images/${f}`} alt={t} tone={tone} />
            <figcaption><em>0{i + 1}</em>{t}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}