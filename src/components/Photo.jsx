import { useState } from 'react'

// Shows /public/images/... if it exists, otherwise a cinematic gradient placeholder.
export default function Photo({ src, alt, tone = 'a', className = '' }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`photo ph-${tone} ${className}`}>
      {ok && <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />}
      {!ok && <span className="ph-label">{alt}</span>}
    </div>
  )
}