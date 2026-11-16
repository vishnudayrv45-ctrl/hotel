import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { MENU, byId } from './data/menu'
import { initSmooth, stopScroll, startScroll } from './lib/smooth'
import { setupScroll } from './lib/scrollFx'
import { ScrollTrigger } from './lib/gsap'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Menu from './components/Menu'
import Story from './components/Story'
import Signature from './components/Signature'
import Gallery from './components/Gallery'
import Reserve from './components/Reserve'
import Footer from './components/Footer'
import FoodModal from './components/FoodModal'
import CartDrawer from './components/CartDrawer'

export default function App() {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(null)
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef()

  const notify = useCallback((msg) => {
    setToast(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2400)
  }, [])

  useEffect(() => initSmooth(), [])

  useEffect(() => {
    if (!ready) return
    const mm = setupScroll()
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(t); mm.revert() }
  }, [ready])

  // lock page scroll while an overlay is open
  useEffect(() => {
    const lock = !!active || cartOpen || !ready
    lock ? stopScroll() : startScroll()
    document.body.style.overflow = lock ? 'hidden' : ''
  }, [active, cartOpen, ready])

  const add = (item, qty = 1) => {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] || 0) + qty }))
    notify(`${item.name} added to your order`)
  }
  const setQty = (id, q) => setCart((c) => {
    const n = { ...c }
    if (q <= 0) delete n[id]; else n[id] = q
    return n
  })
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const place = () => { setCart({}); setCartOpen(false); notify('Order placed ✦ Your table is being prepared (demo)') }
  const nav = useCallback((d) => {
    setActive((a) => {
      if (!a) return a
      const i = MENU.findIndex((m) => m.id === a.id)
      return MENU[(i + d + MENU.length) % MENU.length]
    })
  }, [])

  return (
    <>
      <AnimatePresence>{!ready && <Loader onDone={() => setReady(true)} />}</AnimatePresence>

      <Nav count={count} onCart={() => setCartOpen(true)} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Menu onOpen={setActive} onAdd={add} />
        <Story />
        <Signature onOpen={setActive} onAdd={add} />
        <Gallery />
        <Reserve notify={notify} />
      </main>
      <Footer notify={notify} />

      {/* One shared canvas renders every small 3D preview (cards + signature dishes) */}
      <Canvas className="global-canvas" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <View.Port />
      </Canvas>

      <AnimatePresence>
        {active && <FoodModal key="modal" item={active} onClose={() => setActive(null)} onNav={nav} onAdd={add} />}
      </AnimatePresence>
      <CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onQty={setQty} onPlace={place} />

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>{toast}</motion.div>
        )}
      </AnimatePresence>
    </>
  )
}