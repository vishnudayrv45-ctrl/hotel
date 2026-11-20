import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePersistent } from '../lib/storage'
import { MENU, CATEGORIES } from '../data/menu'
import { api, getToken, setToken } from '../services/api'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  // starts with the local sample menu, then replaced by the server's menu
  const [menu, setMenu] = useState(MENU)
  const [serverOnline, setServerOnline] = useState(false)
  const [cart, setCart] = usePersistent('aurum_cart', {}) // cart stays in the browser
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [messages, setMessages] = useState([])
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(!!getToken())

  const categories = CATEGORIES
  const getDish = (id) => menu.find((m) => m.id === id)

  /* ---- load data from the server ---- */
  const loadMenu = useCallback(async () => {
    try {
      const list = await api.getMenu()
      setMenu(list)
      setServerOnline(true)
    } catch {
      setServerOnline(false) // keep the local sample menu
    }
  }, [])

  useEffect(() => { loadMenu() }, [loadMenu])

  const loadAdminData = useCallback(async () => {
    try {
      const [o, r, m] = await Promise.all([api.getOrders(), api.getReservations(), api.getMessages()])
      setOrders(o)
      setReservations(r)
      setMessages(m)
    } catch {
      if (!getToken()) setIsAdmin(false) // login expired
    }
  }, [])

  const refresh = useCallback(async () => {
    await Promise.all([loadMenu(), loadAdminData()])
  }, [loadMenu, loadAdminData])

  /* ---- cart (browser only) ---- */
  const lines = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ item: menu.find((m) => m.id === id), qty })).filter((l) => l.item),
    [cart, menu]
  )
  const count = lines.reduce((sum, l) => sum + l.qty, 0)
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0)

  const addToCart = (item, qty = 1) => setCart((c) => ({ ...c, [item.id]: Math.min(50, (c[item.id] || 0) + qty) }))
  const setQty = (id, q) =>
    setCart((c) => {
      const next = { ...c }
      if (q <= 0) delete next[id]
      else next[id] = Math.min(q, 50)
      return next
    })
  const removeFromCart = (id) => setQty(id, 0)

  /* ---- customer actions (sent to the server) ---- */
  const placeOrder = async (customer = '') => {
    const order = await api.createOrder({
      customer,
      items: lines.map((l) => ({ id: l.item.id, qty: l.qty })),
    })
    setCart({})
    return order
  }
  const addReservation = (r) => api.createReservation(r)
  const addMessage = (m) => api.sendMessage(m)

  /* ---- admin ---- */
  const adminLogin = async (pin) => {
    const { token } = await api.login(pin)
    setToken(token)
    setIsAdmin(true)
  }
  const adminLogout = async () => {
    try { await api.logout() } catch { /* ignore */ }
    setToken('')
    setIsAdmin(false)
    setOrders([]); setReservations([]); setMessages([])
  }

  const saveItem = async (d) => {
    if (d.id) await api.updateDish(d.id, d)
    else await api.addDish(d)
    await loadMenu()
  }
  const deleteItem = async (id) => {
    await api.deleteDish(id)
    setCart((c) => { const n = { ...c }; delete n[id]; return n })
    await loadMenu()
  }
  const uploadPhoto = async (file) => (await api.uploadPhoto(file)).url

  const updateOrder = async (id, status) => {
    await api.setOrderStatus(id, status)
    setOrders((l) => l.map((o) => (o.id === id ? { ...o, status } : o)))
  }
  const deleteOrder = async (id) => {
    await api.deleteOrder(id)
    setOrders((l) => l.filter((o) => o.id !== id))
  }
  const updateReservation = async (id, status) => {
    await api.setReservationStatus(id, status)
    setReservations((l) => l.map((r) => (r.id === id ? { ...r, status } : r)))
  }
  const deleteReservation = async (id) => {
    await api.deleteReservation(id)
    setReservations((l) => l.filter((r) => r.id !== id))
  }
  const deleteMessage = async (id) => {
    await api.deleteMessage(id)
    setMessages((l) => l.filter((m) => m.id !== id))
  }

  const value = {
    menu, categories, getDish,
    lines, count, cartCount: count, subtotal,
    orders, reservations, messages,
    serverOnline, isAdmin, isAdminOpen, setIsAdminOpen,
    addToCart, setQty, removeFromCart, placeOrder,
    addReservation, addMessage,
    adminLogin, adminLogout, refresh,
    saveItem, deleteItem, uploadPhoto,
    updateOrder, deleteOrder, updateReservation, deleteReservation, deleteMessage,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}