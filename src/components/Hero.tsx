import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export type Persona = 'professional' | 'gamer' | 'casual' | null;

export const Hero = ({ isLoaded, persona }: { isLoaded: boolean, persona: Persona }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine colors based on persona
  const getTheme = () => {
    switch (persona) {
      case 'professional':
        return {
          mesh: '#3b82f6', // blue-500
          textGradient: 'from-blue-400 to-slate-200',
          dropShadow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]',
          subtitle: 'text-blue-200/70'
        };
      case 'gamer':
        return {
          mesh: '#22c55e', // green-500
          textGradient: 'from-green-400 to-slate-200',
          dropShadow: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]',
          subtitle: 'text-green-200/70'
        };
      case 'casual':
        return {
          mesh: '#f97316', // orange-500
          textGradient: 'from-orange-400 to-slate-200',
          dropShadow: 'drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]',
          subtitle: 'text-orange-200/70'
        };
      default:
        return {
          mesh: '#38bdf8', // sky-400
          textGradient: 'from-sky-300 to-slate-200',
          dropShadow: 'drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]',
          subtitle: 'text-sky-200/70'
        };
    }
  };

  const theme = getTheme();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-screen bg-[#020617] text-slate-200 font-sans"
    >
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
            <meshStandardMaterial color={theme.mesh} wireframe={true} />
          </mesh>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none px-4 text-center">
        
        {/* Profile Picture Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: -20 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6 md:mb-8 backdrop-blur-sm bg-black/40 ${theme.dropShadow}`}
        >
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Sagnik&backgroundColor=transparent`} 
            alt="Sagnik Maitra" 
            className="w-full h-full object-cover opacity-90"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${theme.textGradient} pb-2 md:pb-4 ${theme.dropShadow}`}
        >
          Sagnik Maitra
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className={`text-base sm:text-xl md:text-2xl ${theme.subtitle} font-light tracking-wide mt-2 px-2`}
        >
          Nothing is True. Everything is Permitted.
        </motion.p>
      </div>
    </motion.div>
  )
}
