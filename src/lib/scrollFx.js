import { gsap } from './gsap'

// Global scroll choreography: 3D reveals, parallax, curtain clip-path, counters.
export function setupScroll() {
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 90, rotateX: 28, opacity: 0,
        transformPerspective: 1000, transformOrigin: '50% 100%',
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })
    gsap.utils.toArray('[data-speed]').forEach((el) => {
      const sp = parseFloat(el.dataset.speed)
      gsap.to(el, {
        y: () => -sp * 160, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    gsap.utils.toArray('[data-curtain]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'inset(18% 12% 18% 12% round 36px)', scale: 1.08 },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 25%', scrub: true } })
    })
    gsap.utils.toArray('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count)
      const o = { v: 0 }
      gsap.to(o, {
        v: end, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString() },
      })
    })
  })
  return mm
}