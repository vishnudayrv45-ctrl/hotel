import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer, PerspectiveCamera, Float } from '@react-three/drei'
import * as THREE from 'three'
import { FoodModel, FIT } from './Foods'

export const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={2.6} color="#ffe0ad" />
      <directionalLight position={[-5, 2, -4]} intensity={1.8} color="#d9a548" />
      <pointLight position={[0, -2, 3]} intensity={10} color="#ff9d4d" />
    </>
  )
}

// Self-contained reflections (no external HDR download)
export function StudioEnv() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={4} color="#ffe2b0" position={[0, 5, -3]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#d9a548" position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={2} color="#fff" position={[5, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
    </Environment>
  )
}

// cheap blob shadow for the many small card views
let _tex
function shadowTex() {
  if (_tex) return _tex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64)
  gr.addColorStop(0, 'rgba(0,0,0,.7)')
  gr.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  _tex = new THREE.CanvasTexture(c)
  return _tex
}
export function FakeShadow({ y = -1.4, size = 3.4 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={shadowTex()} transparent depthWrite={false} />
    </mesh>
  )
}

function Spinner({ speed, grow, children }) {
  const g = useRef()
  const sp = useRef(speed)
  const sc = useRef(1)
  useFrame((_, dt) => {
    sp.current = THREE.MathUtils.damp(sp.current, speed, 3, dt)
    sc.current = THREE.MathUtils.damp(sc.current, grow, 5, dt)
    if (!REDUCED) g.current.rotation.y += dt * sp.current
    g.current.scale.setScalar(sc.current)
  })
  return <group ref={g}>{children}</group>
}

// Lives inside <View> (drei) — one shared canvas renders every card preview.
export function FoodView({ item, hovered = false, float = false, big = false }) {
  const model = <FoodModel kind={item.kind} tone={item.tone} />
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 6]} rotation={[-0.2, 0, 0]} fov={big ? 36 : 34} />
      <Lights />
      <Spinner speed={hovered ? 1.2 : 0.4} grow={hovered ? 1.14 : 1}>
        <group scale={FIT[item.kind]}>
          {float ? <Float speed={1.6} floatIntensity={0.7} rotationIntensity={0.12}>{model}</Float> : model}
        </group>
      </Spinner>
      <FakeShadow />
    </>
  )
}