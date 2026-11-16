import { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'

// small seeded random so models look the same every load
function rng(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// instanced scatter helper (sesame, rice grains, bubbles...)
function Instances({ items, children }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    items.forEach((it, i) => {
      o.position.set(...it.p)
      o.rotation.set(...(it.r || [0, 0, 0]))
      o.scale.set(...(it.s || [1, 1, 1]))
      o.updateMatrix()
      ref.current.setMatrixAt(i, o.matrix)
      if (it.c) ref.current.setColorAt(i, new THREE.Color(it.c))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [items])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]}>
      {children}
    </instancedMesh>
  )
}

const Std = (p) => <meshStandardMaterial {...p} />
const glass = { color: '#ffffff', transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false }

/* ───────────── BURGER ───────────── */
function Burger({ tone }) {
  const seeds = useMemo(() => {
    const r = rng(7)
    const R = 1.13, S = 0.8
    return Array.from({ length: 38 }, () => {
      const th = r() * 1.15 + 0.05, ph = r() * Math.PI * 2
      return {
        p: [R * Math.sin(th) * Math.cos(ph), 0.05 + S * R * Math.cos(th), R * Math.sin(th) * Math.sin(ph)],
        r: [r() * 3, ph, r() * 3], s: [0.075, 0.04, 0.04],
      }
    })
  }, [])
  return (
    <group>
      <mesh position={[0, -0.52, 0]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[1.1, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <Std color="#d98a3d" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[1.08, 1.04, 0.34, 48]} />
        <Std color="#4a2a1a" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.15, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[2.3, 0.05, 2.3]} />
        <Std color={tone} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.1, 40]} />
        <Std color="#c63a2a" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.6]}>
        <torusGeometry args={[1.05, 0.11, 12, 56]} />
        <Std color="#6fa83b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[1.13, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Std color="#d98a3d" roughness={0.5} />
      </mesh>
      <Instances items={seeds}>
        <sphereGeometry args={[1, 8, 6]} />
        <Std color="#f7ecd2" roughness={0.6} />
      </Instances>
    </group>
  )
}

/* ───────────── PIZZA ───────────── */
function Pizza({ tone }) {
  const pep = useMemo(() => {
    const r = rng(3), out = [[0, 0]]
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + r() * 0.3
      const d = 0.55 + (i % 2) * 0.5 + r() * 0.1
      out.push([Math.cos(a) * d, Math.sin(a) * d])
    }
    return out
  }, [])
  const basil = useMemo(() => {
    const r = rng(11)
    return Array.from({ length: 7 }, () => [(r() - 0.5) * 2, (r() - 0.5) * 2, r() * 3])
  }, [])
  const spots = useMemo(() => {
    const r = rng(21)
    return Array.from({ length: 26 }, () => ({
      p: [(r() - 0.5) * 2.5, 0.115, (r() - 0.5) * 2.5],
      s: [0.14 + r() * 0.12, 0.02, 0.14 + r() * 0.12],
      c: r() > 0.5 ? '#f9e7a8' : '#e2b25a',
    }))
  }, [])
  return (
    <group rotation={[0.6, 0, 0]}>
      <mesh><cylinderGeometry args={[1.6, 1.6, 0.14, 64]} /><Std color="#d9a35a" roughness={0.8} /></mesh>
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.11, 16, 72]} /><Std color="#e6b56a" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[1.45, 1.45, 0.03, 64]} /><Std color={tone} roughness={0.5} /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[1.38, 1.38, 0.04, 64]} /><Std color="#f6dc8a" roughness={0.35} /></mesh>
      <Instances items={spots}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <Std color="#ffffff" roughness={0.4} />
      </Instances>
      {pep.map((p, i) => (
        <mesh key={i} position={[p[0], 0.14, p[1]]}>
          <cylinderGeometry args={[0.21, 0.21, 0.045, 24]} />
          <Std color="#a52a1d" roughness={0.35} />
        </mesh>
      ))}
      {basil.map((b, i) => (
        <mesh key={i} position={[b[0], 0.15, b[1]]} rotation={[0, b[2], 0]} scale={[0.32, 0.025, 0.18]}>
          <sphereGeometry args={[1, 12, 8]} /><Std color="#2f7d32" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/* ───────────── BIRYANI ───────────── */
function Biryani({ tone }) {
  const bowl = useMemo(
    () => [[0.001, 0], [0.75, 0], [0.95, 0.08], [1.5, 0.7], [1.64, 0.98], [1.57, 1.0], [1.45, 0.78], [0.9, 0.2], [0.001, 0.14]]
      .map(([x, y]) => new THREE.Vector2(x, y)), [])
  const grains = useMemo(() => {
    const r = rng(5), R = 1.42, cols = ['#f6e7bf', '#f1d58a', '#e8a04a', '#fff4d6']
    return Array.from({ length: 260 }, () => {
      const th = r() * 1.4, ph = r() * Math.PI * 2
      return {
        p: [R * Math.sin(th) * Math.cos(ph), -0.25 + 0.75 * R * Math.cos(th), R * Math.sin(th) * Math.sin(ph)],
        r: [r() * 3, r() * 3, r() * 3], s: [1, 1, 1], c: cols[Math.floor(r() * 4)],
      }
    })
  }, [])
  const onions = useMemo(() => {
    const r = rng(9)
    return Array.from({ length: 70 }, () => {
      const th = r() * 1.1, ph = r() * Math.PI * 2, R = 1.45
      return {
        p: [R * Math.sin(th) * Math.cos(ph), -0.22 + 0.75 * R * Math.cos(th), R * Math.sin(th) * Math.sin(ph)],
        r: [r() * 3, r() * 3, r() * 3], s: [1, 1, 1], c: r() > 0.5 ? '#7a4a1e' : '#a36a2c',
      }
    })
  }, [])
  const meat = [[0.5, 0.45, 0.3], [-0.55, 0.42, 0.2], [0.05, 0.62, -0.55], [-0.2, 0.55, 0.6]]
  return (
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, -1, 0]}>
        <latheGeometry args={[bowl, 64]} />
        <Std color="#c99a3a" metalness={0.55} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.25, 0]} scale={[1, 0.75, 1]}>
        <sphereGeometry args={[1.4, 48, 24]} /><Std color={tone} roughness={0.8} />
      </mesh>
      <Instances items={grains}>
        <capsuleGeometry args={[0.028, 0.09, 2, 6]} /><Std color="#ffffff" roughness={0.7} />
      </Instances>
      <Instances items={onions}>
        <capsuleGeometry args={[0.02, 0.12, 2, 6]} /><Std color="#ffffff" roughness={0.8} />
      </Instances>
      {meat.map((m, i) => (
        <mesh key={i} position={m} scale={[0.45, 0.32, 0.38]} rotation={[0, i, 0]}>
          <sphereGeometry args={[1, 16, 12]} /><Std color="#8a4a22" roughness={0.6} />
        </mesh>
      ))}
      <group position={[0.7, 0.72, -0.35]}>
        <mesh scale={[0.32, 0.22, 0.32]}><sphereGeometry args={[1, 20, 14]} /><Std color="#fbf6ec" roughness={0.4} /></mesh>
        <mesh position={[0, 0.1, 0]} scale={[0.15, 0.1, 0.15]}><sphereGeometry args={[1, 16, 12]} /><Std color="#f2b01e" roughness={0.3} /></mesh>
      </group>
      {[[-0.35, 0.82, 0.05], [0.2, 0.84, 0.25], [-0.7, 0.62, -0.4]].map((p, i) => (
        <mesh key={i} position={p} rotation={[0.3, i * 2, 0.2]} scale={[0.26, 0.03, 0.13]}>
          <sphereGeometry args={[1, 12, 8]} /><Std color="#2e8b3a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/* ───────────── PASTA ───────────── */
function Pasta({ tone }) {
  const rings = useMemo(() => {
    const r = rng(13)
    return Array.from({ length: 6 }, (_, i) => ({
      y: -0.62 + i * 0.09, rot: [r() * 0.4, r() * 6, r() * 0.4], sc: 1.15 - i * 0.1, k: 3 + (i % 2),
    }))
  }, [])
  return (
    <group position={[0, 0.3, 0]}>
      <mesh position={[0, -0.9, 0]}><cylinderGeometry args={[1.9, 1.7, 0.1, 64]} /><Std color="#f2efe8" roughness={0.25} /></mesh>
      <mesh position={[0, -0.84, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.45, 0.05, 12, 64]} /><Std color="#e6e1d6" roughness={0.3} /></mesh>
      {rings.map((g, i) => (
        <mesh key={i} position={[0, g.y, 0]} rotation={g.rot} scale={g.sc}>
          <torusKnotGeometry args={[0.7, 0.1, 160, 10, 2, g.k]} /><Std color={tone} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, -0.12, 0]} scale={[1, 0.55, 1]}>
        <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><Std color="#b3261e" roughness={0.25} />
      </mesh>
      {[[0.55, -0.2, 0.3], [-0.4, -0.2, 0.5], [-0.1, -0.15, -0.6]].map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.24, 20, 16]} /><Std color="#6b3a22" roughness={0.7} /></mesh>
      ))}
      {[[0.1, 0.05, 0.1], [-0.15, 0.02, -0.15]].map((p, i) => (
        <mesh key={i} position={p} rotation={[0.3, i * 2, 0]} scale={[0.3, 0.03, 0.16]}>
          <sphereGeometry args={[1, 12, 8]} /><Std color="#2f7d32" roughness={0.6} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.3) * 0.5, -0.05 + i * 0.01, Math.sin(i * 1.3) * 0.5]} rotation={[0.2, i, 0.1]}>
          <boxGeometry args={[0.22, 0.015, 0.1]} /><Std color="#fbf1cf" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

/* ───────────── DESSERT ───────────── */
function Dessert({ tone }) {
  const drips = useMemo(() => {
    const r = rng(17)
    return Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + r() * 0.3
      return { a, len: 0.25 + r() * 0.3 }
    })
  }, [])
  return (
    <group position={[0, 0.45, 0]}>
      <mesh position={[0, -0.95, 0]}><cylinderGeometry args={[1.9, 1.8, 0.08, 64]} /><Std color="#1d1b1a" roughness={0.3} metalness={0.2} /></mesh>
      <mesh position={[0, -0.52, 0]}><cylinderGeometry args={[0.85, 0.9, 0.78, 48]} /><Std color="#3a1d12" roughness={0.9} /></mesh>
      <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.87, 0.87, 0.06, 48]} /><Std color={tone} roughness={0.12} metalness={0.15} /></mesh>
      {drips.map((d, i) => (
        <mesh key={i} position={[Math.cos(d.a) * 0.87, -0.12 - d.len / 2, Math.sin(d.a) * 0.87]}>
          <capsuleGeometry args={[0.06, d.len, 4, 8]} /><Std color={tone} roughness={0.12} metalness={0.15} />
        </mesh>
      ))}
      {[[0, 0, 0.1], [0.2, -0.01, -0.1], [-0.2, -0.01, -0.05]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.06 + p[1], p[2]]}><sphereGeometry args={[0.17, 16, 12]} /><Std color="#c2185b" roughness={0.5} /></mesh>
      ))}
      <mesh position={[0.3, 0.05, 0.3]}><sphereGeometry args={[0.1, 14, 10]} /><Std color="#2d3a8c" roughness={0.4} /></mesh>
      <mesh position={[-0.05, 0.2, 0.05]} rotation={[0.4, 0.6, 0.2]} scale={[0.3, 0.03, 0.15]}><sphereGeometry args={[1, 12, 8]} /><Std color="#2f7d32" roughness={0.6} /></mesh>
      {[[-0.4, -0.08, 0.4], [0.45, -0.08, -0.35], [0.1, -0.08, -0.6]].map((p, i) => (
        <mesh key={i} position={p} rotation={[0, i, 0]}><boxGeometry args={[0.13, 0.015, 0.1]} /><Std color="#e7b84a" metalness={0.8} roughness={0.25} emissive="#6b4a10" /></mesh>
      ))}
      <mesh position={[1.2, -0.46, 0.35]}><sphereGeometry args={[0.46, 32, 24]} /><Std color="#f4e9cf" roughness={0.7} /></mesh>
    </group>
  )
}

/* ───────────── BEVERAGE ───────────── */
function Beverage({ tone }) {
  const bubbles = useMemo(() => {
    const r = rng(23)
    return Array.from({ length: 28 }, () => ({
      p: [(r() - 0.5) * 1, -0.9 + r() * 1.6, (r() - 0.5) * 1], s: [0.035, 0.035, 0.035],
    }))
  }, [])
  return (
    <group>
      <mesh><cylinderGeometry args={[0.78, 0.62, 2.2, 48, 1, true]} /><meshStandardMaterial {...glass} /></mesh>
      <mesh position={[0, -1.05, 0]}><cylinderGeometry args={[0.62, 0.62, 0.15, 40]} /><meshStandardMaterial {...glass} opacity={0.35} /></mesh>
      <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.74, 0.6, 1.7, 48]} /><meshStandardMaterial color={tone} transparent opacity={0.9} roughness={0.15} /></mesh>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.745, 0.7, 0.35, 48]} /><meshStandardMaterial color="#fff2cf" transparent opacity={0.45} roughness={0.2} /></mesh>
      <Instances items={bubbles}>
        <sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
      </Instances>
      {[[0.2, 0.55, 0.1, 0.5], [-0.25, 0.3, -0.15, 1.1], [0.1, -0.2, 0.25, 2]].map((c, i) => (
        <mesh key={i} position={[c[0], c[1], c[2]]} rotation={[c[3], c[3] * 2, 0.4]}>
          <boxGeometry args={[0.42, 0.42, 0.42]} /><meshStandardMaterial color="#e9f6ff" transparent opacity={0.5} roughness={0.05} />
        </mesh>
      ))}
      <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, -0.16]}><cylinderGeometry args={[0.05, 0.05, 2.5, 12]} /><Std color="#d9a548" roughness={0.3} /></mesh>
      <group position={[0.74, 1.02, 0]} rotation={[0.1, 0, -0.3]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.42, 0.06, 10, 32]} /><Std color="#f6c533" roughness={0.5} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.4, 0.4, 0.05, 32]} /><Std color="#f9e08a" roughness={0.6} /></mesh>
      </group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.25 + i * 0.12, 1.2 + i * 0.04, 0.1]} rotation={[0.5, i * 1.4, 0.4]} scale={[0.22, 0.03, 0.12]}>
          <sphereGeometry args={[1, 12, 8]} /><Std color="#2e8b3a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

const MAP = { burger: Burger, pizza: Pizza, biryani: Biryani, pasta: Pasta, dessert: Dessert, beverage: Beverage }
export const FIT = { burger: 1, pizza: 0.88, biryani: 0.85, pasta: 0.9, dessert: 1, beverage: 0.85 }

export function FoodModel({ kind, tone }) {
  const C = MAP[kind]
  return <C tone={tone} />
}