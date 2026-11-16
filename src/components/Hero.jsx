import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../lib/gsap'
import { scrollToId } from '../lib/smooth'
import { FoodModel, FIT } from '../three/Foods'
import { Lights, StudioEnv, REDUCED } from '../three/Stage'

const SHOW = [
  { kind: 'burger', tone: '#f2b53d', name: 'Smoked Truffle Burger' },
  { kind: 'pizza', tone: '#c0392b', name: 'Wood-Fired Margherita' },
  { kind: 'biryani', tone: '#f3dfa6', name: 'Royal Dum Biryani' },
  { kind: 'dessert', tone: '#2a140c', name: 'Molten Gold Lava Cake' },
]

function HeroModel({ onChange }) {
  const outer = useRef()
  const inner = useRef()
  const [i, setI] = useState(0)
  const st = useRef({ t: 0, out: false })
  const { viewport } = useThree()

  useEffect(() => { onChange(SHOW[i].name) }, [i, onChange])

  useFrame((s, dt) => {
    const S = st.current
    S.t += dt
    if (!REDUCED && S.t > 6.5 && !S.out) S.out = true
    const base = Math.min(viewport.width / 4, viewport.height / 3.4) * FIT[SHOW[i].kind]
    const k = THREE.MathUtils.damp(inner.current.scale.x, S.out ? 0.001 : base, 5, dt)
    inner.current.scale.setScalar(k)
    if (S.out && k < 0.03) { S.out = false; S.t = 0; setI((v) => (v + 1) % SHOW.length) }
    inner.current.rotation.y += dt * (REDUCED ? 0.1 : 0.45)

    // scroll-driven: food lifts, tips and shrinks as you scroll away
    const p = Math.min(window.scrollY / window.innerHeight, 1.3)
    outer.current.position.y = THREE.MathUtils.damp(outer.current.position.y, p * 1.8, 6, dt)
    outer.current.rotation.x = THREE.MathUtils.damp(outer.current.rotation.x, p * 0.8 - s.pointer.y * 0.18, 4, dt)
    outer.current.rotation.z = THREE.MathUtils.damp(outer.current.rotation.z, s.pointer.x * 0.1, 4, dt)
  })

  return (
    <group ref={outer}>
      <Float speed={1.5} floatIntensity={0.8} rotationIntensity={0.15}>
        <group ref={inner} scale={0.001} rotation={[0.28, 0, 0]}>
          <FoodModel key={i} kind={SHOW[i].kind} tone={SHOW[i].tone} />
        </group>
      </Float>
    </group>
  )
}

export default function Hero({ ready }) {
  const root = useRef()
  const [name, setName] = useState(SHOW[0].name)

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
        .fromTo('.hero-canvas', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.8 }, 0.1)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.9)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero-glow" />
      <h1 className="hero-mega" aria-label="Aurum" data-speed="0.5">
        {'AURUM'.split('').map((c, i) => <span className="mask" key={i}><span>{c}</span></span>)}
      </h1>
      <Canvas className="hero-canvas" dpr={[1, 1.75]} camera={{ position: [0, 0.4, 7], fov: 36 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Lights />
          <StudioEnv />
          <HeroModel onChange={setName} />
          <Sparkles count={90} scale={[11, 6, 6]} size={3} speed={0.35} color="#f4d08a" opacity={0.8} />
          <ContactShadows position={[0, -2.1, 0]} opacity={0.55} scale={11} blur={2.8} far={4.5} color="#000" />
        </Suspense>
      </Canvas>

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
      <div className="now hero-fade"><i /> Now showing — <b key={name}>{name}</b></div>
      <div className="scroll-cue hero-fade" onClick={() => scrollToId('menu')}>
        <div className="mouse"><i /></div><span>Scroll</span>
      </div>
    </section>
  )
}