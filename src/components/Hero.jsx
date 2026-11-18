import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { scrollToId } from '../lib/smooth'
import { useStore } from '../context/StoreContext'

export default function Hero({ ready }) {
  const root = useRef()
  const { menu } = useStore()
  const [i, setI] = useState(0)

  // unique real photos from the menu
  const slides = []
  const seen = new Set()
  menu.forEach((m) => {
    if (m.image && !seen.has(m.image)) {
      seen.add(m.image)
      slides.push({ src: m.image, name: m.name })
    }
  })

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (slides.length < 2 || calm) return
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [slides.length])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-mega .mask > span', { yPercent: 115, rotateX: -80 })
      gsap.set('.hero-fade', { opacity: 0, y: 30 })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5, defaults: { ease: 'power4.out' } })
      tl.to('.hero-mega .mask > span', { yPercent: 0, rotateX: 0, duration: 1.6, stagger: 0.09 })
        .fromTo('.hero-bg', { opacity: 0 }, { opacity: 1, duration: 2 }, 0.1)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.9)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero-bg">
        {slides.map((s, idx) => (
          <img key={s.src} src={s.src} alt={s.name} className={idx === i ? 'on' : ''} />
        ))}
      </div>
      <div className="hero-shade" />

      <h1 className="hero-mega" aria-label="Aurum" data-speed="0.5">
        {'AURUM'.split('').map((c, k) => <span className="mask" key={k}><span>{c}</span></span>)}
      </h1>

      <div className="hero-copy">
        <div className="hero-left hero-fade">
          <span className="eyebrow">Est. 2014 · Wood-fired &amp; slow-spiced</span>
          <p>Where ember meets artistry. Seasonal ingredients, ancient techniques, one unforgettable table.</p>
        </div>
        <div className="hero-right hero-fade">
          <button className="btn gold" onClick={() => scrollToId('menu')}><span>Explore the menu</span></button>
          <button className="btn ghost" onClick={() => scrollToId('reserve')}><span>Reserve a table</span></button>
        </div>
      </div>

      {slides[i] && (
        <div className="now hero-fade"><i /> Now showing — <b key={slides[i].name}>{slides[i].name}</b></div>
      )}
      <div className="scroll-cue hero-fade" onClick={() => scrollToId('menu')}>
        <div className="mouse"><i /></div><span>Scroll</span>
      </div>
    </section>
  )
}