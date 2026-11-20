import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// true when the image loads, false when the file is missing (null while loading)
export function useImageOk(src) {
  const [ok, setOk] = useState(src ? null : false)
  useEffect(() => {
    if (!src) { setOk(false); return }
    setOk(null)
    const img = new Image()
    img.onload = () => setOk(true)
    img.onerror = () => setOk(false)
    img.src = src
  }, [src])
  return ok
}

// these dishes become a round plate (use top-down photos); the rest become a thick card
const ROUND = ['pizza']

export default function PhotoModel({ src, kind, zoom = 1 }) {
  const g = useRef()
  const tex = useTexture(src)
  const aspect = tex.image ? tex.image.width / tex.image.height : 1
  const round = ROUND.includes(kind)

  // centre-crop the photo into a square for the round plate
  const cropped = useMemo(() => {
    const t = tex.clone()
    t.needsUpdate = true
    if (aspect > 1) { t.repeat.set(1 / aspect, 1); t.offset.set((1 - 1 / aspect) / 2, 0) }
    else { t.repeat.set(1, aspect); t.offset.set(0, (1 - aspect) / 2) }
    return t
  }, [tex, aspect])

  useFrame((_, dt) => {
    const s = THREE.MathUtils.damp(g.current.scale.x, zoom, 5, dt)
    g.current.scale.setScalar(s)
  })

  // card keeps the photo's own shape
  let w = 3.4
  let h = 3.4 / aspect
  if (h > 3.4) { h = 3.4; w = 3.4 * aspect }

  return (
    <group ref={g} scale={0.001}>
      <Float speed={1.6} floatIntensity={0.4} rotationIntensity={0}>
        {round ? (
          <group rotation={[1.0, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[1.7, 1.7, 0.16, 96]} />
              <meshStandardMaterial attach="material-0" color="#d9a35a" roughness={0.8} />
              <meshBasicMaterial attach="material-1" map={cropped} toneMapped={false} />
              <meshStandardMaterial attach="material-2" color="#d9a35a" roughness={0.8} />
            </mesh>
          </group>
        ) : (
          <group>
            <mesh>
              <boxGeometry args={[w, h, 0.12]} />
              <meshStandardMaterial color="#e8dcc4" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.062]}>
              <planeGeometry args={[w - 0.1, h - 0.1]} />
              <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -0.062]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[w - 0.1, h - 0.1]} />
              <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>
          </group>
        )}
      </Float>
    </group>
  )
}