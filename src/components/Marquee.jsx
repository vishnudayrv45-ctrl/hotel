const WORDS = ['Wood-fired', 'Slow-spiced', 'Hand-rolled', 'Dum-cooked', 'Small-farm', 'Ember-kissed', 'Made daily']
export default function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...row, ...row].map((w, i) => <span key={i}>{w}<em>✦</em></span>)}
      </div>
    </div>
  )
}