import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Words from './Words'

const TIMES = ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM']
const OCC = ['Date night', 'Birthday', 'Anniversary', 'Business', 'Just hungry']

export default function Reserve({ notify }) {
  const [f, setF] = useState({ name: '', phone: '', date: '', time: TIMES[2], guests: 2, occ: OCC[0] })
  const [done, setDone] = useState(null)
  const [err, setErr] = useState('')
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim() || f.phone.trim().length < 7 || !f.date) { setErr('Please add your name, phone and a date.'); return }
    setErr('')
    setDone('AUR-' + Math.random().toString(36).slice(2, 7).toUpperCase())
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
            {done ? (
              <motion.div key="ok" className="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="check">✓</div>
                <h3>You’re on the list, {f.name.split(' ')[0]}.</h3>
                <p>{f.guests} guests · {f.date} · {f.time}</p>
                <code>{done}</code>
                <button className="btn ghost" onClick={() => setDone(null)}><span>Make another</span></button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} noValidate>
                <div className="row">
                  <label>Name<input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></label>
                  <label>Phone<input value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" inputMode="tel" /></label>
                </div>
                <div className="row">
                  <label>Date<input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} /></label>
                  <label>Time
                    <select value={f.time} onChange={(e) => set('time', e.target.value)}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select>
                  </label>
                </div>
                <div className="row">
                  <div className="field">Guests
                    <div className="stepper">
                      <button type="button" onClick={() => set('guests', Math.max(1, f.guests - 1))}>−</button>
                      <span>{f.guests}</span>
                      <button type="button" onClick={() => set('guests', Math.min(12, f.guests + 1))}>+</button>
                    </div>
                  </div>
                </div>
                <div className="chips">
                  {OCC.map((o) => <button type="button" key={o} className={f.occ === o ? 'on' : ''} onClick={() => set('occ', o)}>{o}</button>)}
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