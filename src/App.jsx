import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './context/StoreContext'
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
import Contact from './components/Contact'
import Footer from './components/Footer'
import FoodModal from './components/FoodModal'
import CartDrawer from './components/CartDrawer'
import Admin from './components/Admin'

export default function App() {
  const {
    menu, lines, count, subtotal,
    addToCart, setQty, removeFromCart, placeOrder,
    isAdminOpen, setIsAdminOpen,
  } = useStore()
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(null)
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
    return () => mm.revert()
  }, [ready])

  // page height can change (menu edits), so refresh scroll positions
  useEffect(() => {
    if (!ready || isAdminOpen) return
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [ready, isAdminOpen, menu.length])

  // lock page scroll while an overlay is open
  useEffect(() => {
    const lock = !!active || cartOpen || isAdminOpen || !ready
    lock ? stopScroll() : startScroll()
    document.body.style.overflow = lock ? 'hidden' : ''
  }, [active, cartOpen, isAdminOpen, ready])

  const add = (item, qty = 1) => {
    addToCart(item, qty)
    notify(`${item.name} added to your order`)
  }

  const place = (name) => {
    const order = placeOrder(name)
    setCartOpen(false)
    notify(`Order ${order.id} placed ✦ (demo)`)
  }

  const nav = useCallback(
    (d) =>
      setActive((a) => {
        if (!a) return a
        const i = menu.findIndex((m) => m.id === a.id)
        if (i === -1) return a
        return menu[(i + d + menu.length) % menu.length]
      }),
    [menu]
  )

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
        <Contact notify={notify} />
      </main>
      <Footer notify={notify} onAdmin={() => setIsAdminOpen(true)} />

      {/* One shared canvas renders the small 3D previews */}
      <Canvas className="global-canvas" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <View.Port />
      </Canvas>

      <AnimatePresence>
        {active && <FoodModal key="modal" item={active} onClose={() => setActive(null)} onNav={nav} onAdd={add} />}
      </AnimatePresence>

      <CartDrawer
        open={cartOpen}
        lines={lines}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onQty={setQty}
        onRemove={removeFromCart}
        onPlace={place}
      />

      {isAdminOpen && <Admin onClose={() => setIsAdminOpen(false)} notify={notify} />}

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}