import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Float } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'
import { FoodModel, FIT } from '../three/Foods'
import { Lights, StudioEnv, REDUCED } from '../three/Stage'

function ModalModel({ item, zoom }) {
  const g = useRef()
  useFrame((_, dt) => {
    const s = THREE.MathUtils.damp(g.current.scale.x, zoom * FIT[item.kind], 5, dt)
    g.current.scale.setScalar(s)
  })
  return (
    <group ref={g} scale={0.001}>
      <Float speed={1.6} floatIntensity={0.5} rotationIntensity={0}>
        <FoodModel kind={item.kind} tone={item.tone} />
      </Float>
    </group>
  )
}

export default function FoodModal({ item, onClose, onNav, onAdd }) {
  const controls = useRef()
  const [mode, setMode] = useState(item.image ? 'photo' : '3d')
  const [auto, setAuto] = useState(!REDUCED)
  const [zoom, setZoom] = useState(1)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setQty(1)
    setZoom(1)
    setAdded(false)
    setMode(item.image ? 'photo' : '3d')
  }, [item.id, item.image])

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose, onNav])

  const clamp = (v) => Math.min(2, Math.max(0.5, v))
  const reset = () => { controls.current && controls.current.reset(); setZoom(1) }
  const add = () => {
    onAdd(item, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} role="dialog" aria-modal="true" aria-label={item.name}>
      <motion.div className="modal-glow" style={{ '--glow': item.accent }} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }} />
      <motion.div className="modal-shell" initial={{ y: 80, rotateX: 12, scale: 0.96 }} animate={{ y: 0, rotateX: 0, scale: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
        <button className="close" onClick={onClose} aria-label="Close">✕</button>

        <div className="stage">
          {item.image && (
            <div className="mode-switch">
              <button className={mode === 'photo' ? 'on' : ''} onClick={() => setMode('photo')}>Photo</button>
              <button className={mode === '3d' ? 'on' : ''} onClick={() => setMode('3d')}>3D</button>
            </div>
          )}

          {mode === '3d' ? (
            <>
              <Canvas dpr={[1, 2]} camera={{ position: [0, 1.8, 6.8], fov: 35 }} gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={null}>
                  <Lights />
                  <StudioEnv />
                  <ModalModel key={item.id} item={item} zoom={zoom} />
                  <ContactShadows position={[0, -1.55, 0]} opacity={0.6} scale={9} blur={2.6} far={3.5} />
                  <OrbitControls
                    ref={controls}
                    enablePan={false}
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={3.5}
                    maxDistance={11}
                    autoRotate={auto}
                    autoRotateSpeed={2.4}
                    maxPolarAngle={Math.PI * 0.62}
                  />
                </Suspense>
              </Canvas>
              <div className="hint">Drag to rotate · Scroll or pinch to zoom</div>
              <div className="tools">
                <button className={auto ? 'on' : ''} onClick={() => setAuto(!auto)}>{auto ? '❚❚ Auto-rotate' : '▶ Auto-rotate'}</button>
                <button onClick={() => setZoom((z) => clamp(z - 0.2))} aria-label="Zoom out">−</button>
                <span className="zoomval">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom((z) => clamp(z + 0.2))} aria-label="Zoom in">+</button>
                <button onClick={reset}>Reset</button>
              </div>
            </>
          ) : (
            <div className="stage-photo">
              <img src={item.image} alt={item.name} onError={() => setMode('3d')} />
            </div>
          )}

          <button className="nav-arrow prev" onClick={() => onNav(-1)} aria-label="Previous dish">‹</button>
          <button className="nav-arrow next" onClick={() => onNav(1)} aria-label="Next dish">›</button>
        </div>

        <div className="info" data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.div key={item.id} initial="hidden" animate="show" exit="out" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } }, out: { opacity: 0, y: -20, transition: { duration: 0.2 } } }}>
              <motion.span className="chip" variants={rise}>{item.cat}{item.veg ? ' · Veg' : ''}</motion.span>
              <motion.h2 variants={rise}>{item.name}</motion.h2>
              <motion.p className="tag" variants={rise}>{item.tagline}</motion.p>
              <motion.p className="desc" variants={rise}>{item.desc}</motion.p>

              <motion.div className="stats" variants={rise}>
                <div><b>{item.cal}</b><small>kcal</small></div>
                <div><b>{item.time}</b><small>prep</small></div>
                <div>
                  <b className="spice">{[0, 1, 2].map((n) => <i key={n} className={n < item.spice ? 'hot' : ''} />)}</b>
                  <small>spice</small>
                </div>
              </motion.div>

              <motion.h4 variants={rise}>Ingredients</motion.h4>
              <motion.ul className="ingr" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
                {item.ingredients.map((g) => <motion.li key={g} variants={rise}>{g}</motion.li>)}
              </motion.ul>

              <motion.div className="buy" variants={rise}>
                <div className="price">₹{item.price * qty}</div>
                <div className="stepper">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(20, qty + 1))} aria-label="More">+</button>
                </div>
                <motion.button className={`btn gold big ${added ? 'done' : ''}`} onClick={add} whileTap={{ scale: 0.95 }}>
                  <span>{added ? '✓ Added to order' : 'Add to order'}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } } }