import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Words from './Words'
import { useStore } from '../context/StoreContext'

const TOPICS = [
  'Private Dining & Hearth',
  'Dietary & Allergies',
  'Chef’s Table Experience',
  'Corporate & Events',
  'Press & Collaboration',
  'General Inquiry',
]

export default function Contact() {
  const { addMessage } = useStore()
  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    subject: TOPICS[0],
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [sending, setSending] = useState(false)

  const set = (k, v) => setF((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!f.name.trim() || !f.email.trim() || !f.message.trim()) {
      setErr('Please fill in your name, email, and message.')
      return
    }
    setErr('')
    setSending(true)

    setTimeout(() => {
      addMessage({
        name: f.name.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
        subject: f.subject,
        message: f.message.trim(),
      })
      setSending(false)
      setSent(true)
    }, 400)
  }

  return (
    <section id="contact" className="section contact">
      <div className="section-head">
        <span className="eyebrow" data-reveal>Contact &amp; Concierge</span>
        <Words text="Let’s start a conversation." />
        <p className="lead" data-reveal>
          Whether reserving our private hearth room, discussing dietary requirements, or planning an intimate tasting dinner — our concierge is at your service.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-details" data-reveal>
          <div className="contact-card">
            <h4>Location &amp; Valet</h4>
            <p>12 Ember Lane, 100ft Road<br />Indiranagar, Bengaluru 560038</p>
            <small>Complimentary valet service available at front portico.</small>
          </div>

          <div className="contact-card">
            <h4>Direct Lines</h4>
            <p>
              Dining &amp; Tables: <a href="tel:+918049208800">+91 80 4920 8800</a><br />
              Private Events: <a href="mailto:events@aurum.dining">events@aurum.dining</a><br />
              Press: <a href="mailto:press@aurum.dining">press@aurum.dining</a>
            </p>
          </div>

          <div className="contact-card">
            <h4>Dining Hours</h4>
            <p>
              Lunch: 12:30 PM – 3:30 PM (Daily)<br />
              Dinner: 6:30 PM – 11:00 PM (Mon – Thu)<br />
              Late Hearth: 6:30 PM – 12:00 AM (Fri – Sun)
            </p>
          </div>
        </div>

        <div className="contact-form-wrap" data-reveal>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent-ok"
                className="success contact-success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="check">✓</div>
                <h3>Message Received, {f.name.split(' ')[0]}.</h3>
                <p>
                  Thank you for reaching out to Aurum. Our maître d’ or event director will respond to <b>{f.email}</b> within 24 hours.
                </p>
                <button
                  className="btn ghost"
                  onClick={() => {
                    setSent(false)
                    setF({ name: '', email: '', phone: '', subject: TOPICS[0], message: '' })
                  }}
                >
                  <span>Send another message</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                noValidate
              >
                <div className="row">
                  <label>Full Name
                    <input
                      value={f.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="e.g. Neil Roy"
                      required
                    />
                  </label>
                  <label>Email Address
                    <input
                      type="email"
                      value={f.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="neil@example.com"
                      required
                    />
                  </label>
                </div>

                <div className="row">
                  <label>Phone Number (optional)
                    <input
                      type="tel"
                      value={f.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+91 …"
                    />
                  </label>
                  <label>Inquiry Topic
                    <select value={f.subject} onChange={(e) => set('subject', e.target.value)}>
                      {TOPICS.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>Message
                  <textarea
                    rows={4}
                    value={f.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Tell us about your event, party size, preferred dates, or questions..."
                    required
                  />
                </label>

                {err && <p className="err">{err}</p>}

                <button
                  className="btn gold big wide"
                  type="submit"
                  disabled={sending}
                >
                  <span>{sending ? 'Transmitting…' : 'Send Message ✦'}</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
