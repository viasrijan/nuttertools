import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / Math.max(el.clientHeight, 1), 0.1, 100)
    camera.position.z = 22

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const count = 160
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24
      sizes[i] = 0.5 + Math.random() * 1.2
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.09,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    const ringGeo = new THREE.TorusGeometry(14, 0.06, 8, 120)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.22 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.4
    ring.rotation.z = 0.5
    scene.add(ring)

    const ring2 = new THREE.Mesh(ringGeo, ringMat)
    ring2.scale.setScalar(1.35)
    ring2.rotation.x = Math.PI / 1.9
    ring2.rotation.y = 0.6
    ;(ring2.material as THREE.MeshBasicMaterial).opacity = 0.1
    scene.add(ring2)

    let raf = 0
    const tick = () => {
      points.rotation.y += 0.0005
      ring.rotation.z += 0.0006
      ring2.rotation.z -= 0.0004
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    if (reduced) renderer.render(scene, camera)
    else tick()

    const onResize = () => {
      const w = el.clientWidth, h = Math.max(el.clientHeight, 1)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 pointer-events-none opacity-70" aria-hidden />
}