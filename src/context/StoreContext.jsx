import { createContext, useContext, useMemo, useState } from 'react'
import { usePersistent } from '../lib/storage'
import { MENU, CATEGORIES } from '../data/menu'
import { SAMPLE_ORDERS, SAMPLE_RESERVATIONS, SAMPLE_MESSAGES } from '../data/samples'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

// category -> 3D model type, default colour and emoji for newly added dishes
const KIND = { Burgers: 'burger', Pizzas: 'pizza', Biryani: 'biryani', Pasta: 'pasta', Desserts: 'dessert', Beverages: 'beverage' }
const TONE = { burger: '#f2b53d', pizza: '#c0392b', biryani: '#f3dfa6', pasta: '#f1d27a', dessert: '#2a140c', beverage: '#f4a640' }
const EMOJI = { Burgers: '🍔', Pizzas: '🍕', Biryani: '🍛', Pasta: '🍝', Desserts: '🍰', Beverages: '🍹' }

const uid = (prefix) => prefix + Math.random().toString(36).slice(2, 7).toUpperCase()
const now = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

export function StoreProvider({ children }) {
  const [menu, setMenu] = usePersistent('aurum_menu_v2', MENU)
  const [cart, setCart] = usePersistent('aurum_cart', {})
  const [reservations, setReservations] = usePersistent('aurum_reservations', SAMPLE_RESERVATIONS)
  const [orders, setOrders] = usePersistent('aurum_orders', SAMPLE_ORDERS)
  const [messages, setMessages] = usePersistent('aurum_messages', SAMPLE_MESSAGES)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  const categories = CATEGORIES
  const getDish = (id) => menu.find((m) => m.id === id)

  // cart lines = cart ids matched to menu items (deleted dishes drop out automatically)
  const lines = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ item: menu.find((m) => m.id === id), qty })).filter((l) => l.item),
    [cart, menu]
  )
  const count = lines.reduce((sum, l) => sum + l.qty, 0)
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0)

  /* ---- cart ---- */
  const addToCart = (item, qty = 1) => setCart((c) => ({ ...c, [item.id]: Math.min(50, (c[item.id] || 0) + qty) }))
  const setQty = (id, q) =>
    setCart((c) => {
      const next = { ...c }
      if (q <= 0) delete next[id]
      else next[id] = Math.min(q, 50)
      return next
    })
  const removeFromCart = (id) => setQty(id, 0)

  const placeOrder = (customer = '') => {
    const gst = Math.round(subtotal * 0.05)
    const order = {
      id: uid('ORD-'),
      customer: customer.trim() || 'Guest',
      date: now(),
      items: lines.map((l) => ({ name: l.item.name, qty: l.qty, price: l.item.price })),
      total: subtotal + gst,
      status: 'New',
    }
    setOrders((o) => [order, ...o])
    setCart({})
    return order
  }

  /* ---- reservations & contact ---- */
  const addReservation = (r) => {
    const booking = { ...r, id: uid('AUR-'), status: 'Pending' }
    setReservations((list) => [booking, ...list])
    return booking
  }
  const addMessage = (m) => setMessages((list) => [{ ...m, id: uid('MSG-'), date: now() }, ...list])

  /* ---- admin: menu ---- */
  const saveItem = (d) => {
    const kind = KIND[d.cat]
    if (menu.some((m) => m.id === d.id)) {
      setMenu((list) =>
        list.map((x) => (x.id === d.id ? { ...x, ...d, kind, tone: x.cat === d.cat ? x.tone : TONE[kind] } : x))
      )
    } else {
      const item = { tone: TONE[kind], accent: '#d9a548', emoji: EMOJI[d.cat], ...d, kind, id: uid('item-').toLowerCase() }
      setMenu((list) => [...list, item])
    }
  }
  const deleteItem = (id) => {
    setMenu((list) => list.filter((m) => m.id !== id))
    setCart((c) => {
      const next = { ...c }
      delete next[id]
      return next
    })
  }

  /* ---- admin: orders / reservations / messages ---- */
  const updateOrder = (id, status) => setOrders((l) => l.map((o) => (o.id === id ? { ...o, status } : o)))
  const deleteOrder = (id) => setOrders((l) => l.filter((o) => o.id !== id))
  const updateReservation = (id, status) => setReservations((l) => l.map((r) => (r.id === id ? { ...r, status } : r)))
  const deleteReservation = (id) => setReservations((l) => l.filter((r) => r.id !== id))
  const deleteMessage = (id) => setMessages((l) => l.filter((m) => m.id !== id))

  const resetDemo = () => {
    setMenu(MENU); setCart({}); setOrders(SAMPLE_ORDERS); setReservations(SAMPLE_RESERVATIONS); setMessages(SAMPLE_MESSAGES)
  }

  const value = {
    menu, categories, getDish,
    lines, count, cartCount: count, subtotal,
    orders, reservations, messages,
    isAdminOpen, setIsAdminOpen,
    addToCart, setQty, removeFromCart, placeOrder,
    addReservation, addMessage,
    saveItem, deleteItem,
    updateOrder, deleteOrder, updateReservation, deleteReservation, deleteMessage,
    resetDemo,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}