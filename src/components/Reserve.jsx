import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import Words from './Words'

const TIMES = ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM']
const OCC = ['Date night', 'Birthday', 'Anniversary', 'Business', 'Just hungry']

export default function Reserve({ notify }) {
  const { addReservation } = useStore()
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
  const [f, setF] = useState({ name: '', date: '', time: TIMES[2], guests: 2, occasion: OCC[0] })
  const [booking, setBooking] = useState(null)
  const [err, setErr] = useState('')
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setErr('Please enter your name.')
    if (!f.date) return setErr('Please choose a date.')
    if (f.date < today) return setErr('Please choose today or a future date.')
    setErr('')
    const saved = addReservation({ ...f, name: f.name.trim(), phone: '' })
    setBooking(saved)
    notify('Table reserved ✦ (demo)')
  }

  return (
    <section id="reserve" className="section reserve">
      <div className="reserve-grid">
        <div className="reserve-copy">
          <span className="eyebrow" data-reveal>Reservations</span>
          <Words text="Save your seat by the fire." />
          <p className="lead" data-reveal>Tables release 30 days ahead. Parties of 8 or more — ask about our private hearth room.</p>
          <ul className="hours" data-reveal>
            <li><span>Mon – Thu</span><b>6:30 PM – 11 PM</b></li>
            <li><span>Fri – Sat</span><b>6:30 PM – 12 AM</b></li>
            <li><span>Sunday</span><b>1 PM – 10 PM</b></li>
          </ul>
        </div>

        <div className="reserve-card" data-reveal>
          <AnimatePresence mode="wait">
            {booking ? (
              <motion.div key="ok" className="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="check">✓</div>
                <h3>You’re on the list, {booking.name.split(' ')[0]}.</h3>
                <p>{booking.guests} guests · {booking.date} · {booking.time}</p>
                <code>{booking.id}</code>
                <button className="btn ghost" onClick={() => setBooking(null)}><span>Make another</span></button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label>Name<input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></label>
                <div className="row">
                  <label>Date<input type="date" min={today} value={f.date} onChange={(e) => set('date', e.target.value)} /></label>
                  <label>Time
                    <select value={f.time} onChange={(e) => set('time', e.target.value)}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select>
                  </label>
                </div>
                <div className="field">Guests
                  <div className="stepper">
                    <button type="button" onClick={() => set('guests', Math.max(1, f.guests - 1))}>−</button>
                    <span>{f.guests}</span>
                    <button type="button" onClick={() => set('guests', Math.min(12, f.guests + 1))}>+</button>
                  </div>
                </div>
                <div className="chips">
                  {OCC.map((o) => <button type="button" key={o} className={f.occasion === o ? 'on' : ''} onClick={() => set('occasion', o)}>{o}</button>)}
                </div>
                {err && <p className="err">{err}</p>}
                <button className="btn gold big wide" type="submit"><span>Confirm reservation</span></button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}