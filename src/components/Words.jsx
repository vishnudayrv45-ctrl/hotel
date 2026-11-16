import { useLayoutEffect, useRef } from 'react'
import { gsap, reduced } from '../lib/gsap'

// Scroll-triggered word-by-word 3D text reveal
export default function Words({ text, as: Tag = 'h2', className = '' }) {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.w > span'), {
        yPercent: 115, rotateX: -70, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07,
        transformOrigin: '0% 100%',
        scrollTrigger: { trigger: ref.current, start: 'top 88%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <Tag ref={ref} className={`words ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="w" key={i} aria-hidden="true"><span>{w}</span></span>
      ))}
    </Tag>
  )
}