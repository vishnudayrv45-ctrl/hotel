import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { CATEGORIES } from '../data/menu'

const CATS = CATEGORIES.filter((c) => c !== 'All')
const blank = { name: '', cat: 'Burgers', price: '', tagline: '', desc: '', ingredientsText: '', image: '', veg: false, spice: 0, cal: 500, time: '15 min' }

export default function Admin({ onClose, notify }) {
  const s = useStore()
  const [pin, setPin] = useState('')
  const [pinErr, setPinErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('dashboard')
  const [draft, setDraft] = useState(null)
  const [err, setErr] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])

  // load fresh data from the server when logged in
  useEffect(() => {
    if (s.isAdmin) s.refresh()
  }, [s.isAdmin])

  // run any server action and show an error toast if it fails
  const run = async (fn, okMsg) => {
    try {
      await fn()
      if (okMsg) notify(okMsg)
    } catch (e) {
      notify(e.message)
    }
  }

  const login = async (e) => {
    e.preventDefault()
    setBusy(true)
    setPinErr('')
    try {
      await s.adminLogin(pin)
      setPin('')
    } catch (error) {
      setPinErr(error.message)
    }
    setBusy(false)
  }

  /* ---- menu editing ---- */
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))
  const edit = (item) => setDraft({ ...item, ingredientsText: (item.ingredients || []).join(', ') })

  const save = async (e) => {
    e.preventDefault()
    if (!draft.name.trim()) return setErr('Dish name is required.')
    if (!(Number(draft.price) > 0)) return setErr('Enter a price above 0.')
    const { ingredientsText, ...rest } = draft
    try {
      await s.saveItem({
        ...rest,
        name: rest.name.trim(),
        price: Number(rest.price),
        spice: Number(rest.spice),
        cal: Number(rest.cal) || 0,
        ingredients: ingredientsText.split(',').map((x) => x.trim()).filter(Boolean),
      })
      notify(draft.id ? 'Dish updated' : 'Dish added')
      setDraft(null)
      setErr('')
    } catch (error) {
      setErr(error.message)
    }
  }

  const del = (item) => {
    if (window.confirm(`Delete "${item.name}"?`)) run(() => s.deleteItem(item.id), 'Dish deleted')
  }

  const onPhoto = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setUploading(true)
    setErr('')
    try {
      const url = await s.uploadPhoto(file)
      set('image', url)
    } catch (error) {
      setErr(error.message)
    }
    setUploading(false)
    e.target.value = ''
  }

  const revenue = s.orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)

  /* ---- login screen ---- */
  if (!s.isAdmin) {
    return (
      <div className="admin">
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
        <form className="admin-login" onSubmit={login}>
          <h2>Admin</h2>
          <p>Enter the admin PIN (demo PIN: <b>1234</b>).</p>
          {!s.serverOnline && <span className="err">Server not reachable. Start it with “npm run dev” inside the server folder.</span>}
          <input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setPinErr('') }} placeholder="PIN" autoFocus />
          {pinErr && <span className="err">{pinErr}</span>}
          <button className="btn gold big wide" type="submit" disabled={busy}><span>{busy ? 'Checking…' : 'Enter'}</span></button>
        </form>
      </div>
    )
  }

  const TABS = [['dashboard', 'Dashboard'], ['menu', 'Menu'], ['orders', 'Orders'], ['reservations', 'Reservations'], ['messages', 'Messages']]

  return (
    <div className="admin" data-lenis-prevent>
      <div className="admin-bar">
        <h2>AURUM Admin</h2>
        <div className="admin-tabs">
          {TABS.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        <div className="admin-right">
          <button className="mini" onClick={() => run(() => s.refresh(), 'Refreshed')}>Refresh</button>
          <button className="mini" onClick={() => s.adminLogout()}>Log out</button>
          <button className="mini" onClick={onClose}>Close ✕</button>
        </div>
      </div>

      <div className="admin-body">
        {!s.serverOnline && <p className="err">Server offline: changes will not be saved. Start it inside the server folder.</p>}

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <>
            <div className="stat-grid">
              <div><b>{s.menu.length}</b><small>Dishes</small></div>
              <div><b>{s.orders.length}</b><small>Orders</small></div>
              <div><b>₹{revenue}</b><small>Revenue</small></div>
              <div><b>{s.reservations.length}</b><small>Reservations</small></div>
              <div><b>{s.messages.length}</b><small>Messages</small></div>
            </div>
            <h3>Latest orders</h3>
            {s.orders.length === 0 && <p className="empty">No orders yet.</p>}
            {s.orders.slice(0, 4).map((o) => (
              <div className="arow" key={o.id}><b>{o.id}</b><span>{o.customer}</span><span>₹{o.total}</span><em className={`st ${o.status}`}>{o.status}</em></div>
            ))}
          </>
        )}

        {/* MENU */}
        {tab === 'menu' && (
          <>
            {!draft && <button className="btn gold" onClick={() => setDraft({ ...blank })}><span>+ Add dish</span></button>}
            {draft && (
              <form className="admin-form" onSubmit={save}>
                <h3>{draft.id ? 'Edit dish' : 'New dish'}</h3>
                <div className="row">
                  <label>Name<input value={draft.name} onChange={(e) => set('name', e.target.value)} /></label>
                  <label>Category
                    <select value={draft.cat} onChange={(e) => set('cat', e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
                  </label>
                </div>
                <div className="row">
                  <label>Price (₹)<input type="number" min="1" value={draft.price} onChange={(e) => set('price', e.target.value)} /></label>
                  <label>Tagline<input value={draft.tagline} onChange={(e) => set('tagline', e.target.value)} /></label>
                </div>
                <label>Description<textarea rows="3" value={draft.desc} onChange={(e) => set('desc', e.target.value)} /></label>
                <label>Ingredients (comma separated)<input value={draft.ingredientsText} onChange={(e) => set('ingredientsText', e.target.value)} placeholder="Basil, Mozzarella, Tomato" /></label>

                <div className="photo-up">
                  <label>Dish photo (JPG, PNG or WEBP, max 3 MB)
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} />
                  </label>
                  {uploading && <small>Uploading…</small>}
                  {draft.image && <img src={draft.image} alt="Preview" />}
                </div>

                <div className="row">
                  <label>Calories<input type="number" value={draft.cal} onChange={(e) => set('cal', e.target.value)} /></label>
                  <label>Prep time<input value={draft.time} onChange={(e) => set('time', e.target.value)} /></label>
                </div>
                <div className="row">
                  <label>Spice level
                    <select value={draft.spice} onChange={(e) => set('spice', e.target.value)}>
                      <option value="0">0 – Mild</option><option value="1">1</option><option value="2">2</option><option value="3">3 – Hot</option>
                    </select>
                  </label>
                  <label className="check-row"><input type="checkbox" checked={draft.veg} onChange={(e) => set('veg', e.target.checked)} /> Vegetarian</label>
                </div>
                {err && <span className="err">{err}</span>}
                <div className="form-btns">
                  <button className="btn gold" type="submit" disabled={uploading}><span>Save dish</span></button>
                  <button className="btn ghost" type="button" onClick={() => { setDraft(null); setErr('') }}><span>Cancel</span></button>
                </div>
              </form>
            )}
            {s.menu.map((m) => (
              <div className="arow" key={m.id}>
                <span className="thumb">{m.image ? <img src={m.image} alt="" /> : m.emoji}</span>
                <b>{m.name}</b><span>{m.cat}</span><span>₹{m.price}</span>
                <span className="acts">
                  <button className="mini" onClick={() => edit(m)}>Edit</button>
                  <button className="mini danger" onClick={() => del(m)}>Delete</button>
                </span>
              </div>
            ))}
          </>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (s.orders.length === 0 ? <p className="empty">No orders yet.</p> : s.orders.map((o) => (
          <div className="arow tall" key={o.id}>
            <div><b>{o.id}</b> · {o.customer}<small>{o.date}</small>
              <small>{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</small></div>
            <span>₹{o.total}</span>
            <span className="acts">
              <select value={o.status} onChange={(e) => run(() => s.updateOrder(o.id, e.target.value))}>
                {['New', 'Preparing', 'Served', 'Cancelled'].map((x) => <option key={x}>{x}</option>)}
              </select>
              <button className="mini danger" onClick={() => run(() => s.deleteOrder(o.id))}>Delete</button>
            </span>
          </div>
        )))}

        {/* RESERVATIONS */}
        {tab === 'reservations' && (s.reservations.length === 0 ? <p className="empty">No reservations yet.</p> : s.reservations.map((r) => (
          <div className="arow tall" key={r.id}>
            <div><b>{r.id}</b> · {r.name}<small>{r.date} at {r.time} · {r.guests} guests · {r.occasion}</small></div>
            <span className="acts">
              <select value={r.status} onChange={(e) => run(() => s.updateReservation(r.id, e.target.value))}>
                {['Pending', 'Confirmed', 'Cancelled'].map((x) => <option key={x}>{x}</option>)}
              </select>
              <button className="mini danger" onClick={() => run(() => s.deleteReservation(r.id))}>Delete</button>
            </span>
          </div>
        )))}

        {/* MESSAGES */}
        {tab === 'messages' && (s.messages.length === 0 ? <p className="empty">No messages yet.</p> : s.messages.map((m) => (
          <div className="arow tall" key={m.id}>
            <div>
              <b>{m.name}</b> · {m.email}{m.phone ? ` · ${m.phone}` : ''}
              <small>{m.date}{m.subject ? ` · ${m.subject}` : ''}</small>
              <small>{m.message}</small>
            </div>
            <button className="mini danger" onClick={() => run(() => s.deleteMessage(m.id))}>Delete</button>
          </div>
        )))}
      </div>
    </div>
  )
}