import { Logo } from './Nav'
import { scrollToId } from '../lib/smooth'

export default function Footer({ notify, onAdmin }) {
  const demo = () => notify('Demo link — frontend only')
  return (
    <footer className="footer">
      <div className="foot-top">
        <Logo />
        <div><h5>Visit</h5><p>12 Ember Lane, Indiranagar<br />Bengaluru 560038</p></div>
        <div><h5>Contact</h5><p>hello@aurum.demo<br />+91 80 0000 0000</p></div>
        <div>
          <h5>Follow</h5>
          <p className="soc">
            <button onClick={demo}>Instagram</button><button onClick={demo}>X</button><button onClick={demo}>YouTube</button>
          </p>
        </div>
      </div>
      <div className="foot-big" aria-hidden="true">AURUM</div>
      <div className="foot-bot">
        <span>© 2026 Aurum Fire &amp; Spice Kitchen — a practice project with sample data.</span>
        <span className="foot-links">
          <button onClick={onAdmin}>Admin</button>
          <button onClick={() => scrollToId('top')}>Back to top ↑</button>
        </span>
      </div>
    </footer>
  )
}