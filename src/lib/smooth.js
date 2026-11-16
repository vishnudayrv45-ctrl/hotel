import Lenis from 'lenis'
import { gsap, ScrollTrigger, reduced } from './gsap'

let lenis = null

export function initSmooth() {
  if (reduced()) return null
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (t) => lenis.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
  }
}

export const stopScroll = () => lenis && lenis.stop()
export const startScroll = () => lenis && lenis.start()

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.8 })
  else el.scrollIntoView({ behavior: 'smooth' })
}