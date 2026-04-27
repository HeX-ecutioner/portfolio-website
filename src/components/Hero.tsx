import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export const Hero = ({ isLoaded }: { isLoaded: boolean }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#020617] text-slate-200 font-sans">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={isMobile ? [1, 1.5] : [1, 2]} performance={{ min: 0.5 }}>
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />
          <Stars 
            radius={100} 
            depth={50} 
            count={isMobile ? 1500 : 5000} 
            factor={isMobile ? 2 : 4} 
            saturation={0} 
            fade 
            speed={1} 
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <mesh>
            <torusKnotGeometry args={isMobile ? [9, 3, 128, 3] : [9, 3, 768, 3]} />
            <meshStandardMaterial color="#38bdf8" wireframe={true} />
          </mesh>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-slate-200 pb-2 md:pb-4 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
        >
          Sagnik Maitra
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className="text-base sm:text-xl md:text-2xl text-sky-200/70 font-light tracking-wide mt-2 px-2"
        >
          Nothing is True. Everything is Permitted.
        </motion.p>
      </div>
    </div>
  )
}
