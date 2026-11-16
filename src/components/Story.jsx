import Photo from './Photo'
import Words from './Words'

export default function Story() {
  return (
    <section id="story" className="section story">
      <div className="section-head">
        <span className="eyebrow" data-reveal>Our Story</span>
        <Words text="Born from fire, perfected by patience." />
      </div>

      <div className="story-grid">
        <div className="story-big" data-curtain>
          <Photo src="/images/interior-1.jpg" alt="The Ember Hall" tone="a" />
        </div>
        <div className="story-text">
          <p data-reveal className="lead">In 2014, two chefs — one trained in Naples, one raised on the dum kitchens of Hyderabad — lit a single oak fire and refused to put it out.</p>
          <p data-reveal>Today Aurum is a room built around that flame: low amber light, hand-laid brass, a open hearth that never goes cold. Every dish is a conversation between two traditions, cooked slowly, served beautifully, and meant to be remembered.</p>
          <div className="stats-row" data-reveal>
            <div><b data-count="12">0</b><small>Years of fire</small></div>
            <div><b data-count="48">0</b><small>Small farms</small></div>
            <div><b data-count="72">0</b><small>Hour dough</small></div>
          </div>
        </div>
        <div className="story-small" data-speed="0.7">
          <Photo src="/images/interior-2.jpg" alt="The Brass Bar" tone="b" />
        </div>
      </div>

      <div className="pillars">
        {[['🔥', 'Wood Fire', 'Oak and olive wood, 450°C, no shortcuts.'], ['🌿', 'Slow Spice', 'Whole spices toasted and ground each dawn.'], ['🌾', 'Small Farms', 'Seasonal produce from growers we know by name.']].map(([e, t, d]) => (
          <div className="pillar" key={t} data-reveal>
            <span>{e}</span><h4>{t}</h4><p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}