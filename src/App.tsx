import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Lenis from 'lenis'

function App() {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="relative w-full h-screen bg-neutral-950 text-white font-sans">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <mesh>
            <torusKnotGeometry args={[9, 3, 768, 3]} />
            <meshStandardMaterial color="#6366f1" wireframe={true} />
          </mesh>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4"
        >
          Sagnik Maitra
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl md:text-2xl text-neutral-400 font-light"
        >
          Nothing is True. Everything is Permitted.
        </motion.p>
      </div>
    </div>
  )
}

export default App
