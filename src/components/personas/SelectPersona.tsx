import { motion } from 'framer-motion';
import { useState } from 'react';

type PersonaProps = {
  onSelect: (persona: 'professional' | 'gamer' | 'casual') => void;
};

const personas = [
  {
    id: 'professional',
    title: 'Professional',
    color: 'from-blue-600 to-blue-900',
    borderColor: 'border-blue-500',
    hoverColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    innerGlow: 'from-blue-500/20',
    icon: '👔',
    description: 'Corporate, sleek, and strictly business.',
    gtaColor: '#3b82f6'
  },
  {
    id: 'casual',
    title: 'Casual',
    color: 'from-orange-500 to-orange-800',
    borderColor: 'border-orange-500',
    hoverColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    innerGlow: 'from-orange-500/20',
    icon: '🌴',
    description: 'Laid back, creative, and easy going.',
    gtaColor: '#f97316'
  },
  {
    id: 'gamer',
    title: 'Gamer',
    color: 'from-green-600 to-green-900',
    borderColor: 'border-green-500',
    hoverColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    innerGlow: 'from-green-500/20',
    icon: '🎮',
    description: 'High APM, neon lights, and raw performance.',
    gtaColor: '#22c55e'
  }
] as const;

export const SelectPersona = ({ onSelect }: PersonaProps) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div 
      className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1, 
        filter: 'blur(10px)',
        transition: { duration: 0.8, ease: "easeInOut" } 
      }}
    >
      {/* Background ambient light based on hover */}
      <div className="absolute inset-0 z-0 opacity-30 transition-colors duration-500" 
           style={{
             background: hovered === 'professional' ? 'radial-gradient(circle at center, #1e3a8a 0%, #0a0a0a 70%)' :
                         hovered === 'gamer' ? 'radial-gradient(circle at center, #14532d 0%, #0a0a0a 70%)' :
                         hovered === 'casual' ? 'radial-gradient(circle at center, #7c2d12 0%, #0a0a0a 70%)' :
                         'radial-gradient(circle at center, #262626 0%, #0a0a0a 70%)'
           }}
      />

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 mb-8 md:mb-16 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          Select Persona
        </h2>
        <p className="text-slate-400 mt-2 font-mono text-sm md:text-base tracking-widest uppercase">
          Choose your playstyle
        </p>
      </motion.div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-4 md:gap-6 h-[65vh] md:h-[500px]">
        {personas.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
            onHoverStart={() => setHovered(p.id)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => onSelect(p.id as any)}
            className={`
              relative flex-1 group cursor-pointer overflow-hidden rounded-2xl
              border-2 border-white/10 bg-black/40 backdrop-blur-md
              transition-all duration-500 ease-out flex flex-col items-center justify-center
              hover:flex-[1.5] md:hover:flex-[1.5]
            `}
            style={{
              boxShadow: hovered === p.id ? `0 0 30px ${p.gtaColor}40` : 'none',
              borderColor: hovered === p.id ? p.gtaColor : 'rgba(255,255,255,0.1)'
            }}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
            
            {/* Scanlines / Noise overlay */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mix-blend-overlay" />

            <div className="relative z-10 flex flex-col items-center p-6 text-center">
              <motion.span 
                className="text-5xl md:text-7xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 drop-shadow-2xl"
              >
                {p.icon}
              </motion.span>
              <h3 className={`text-3xl md:text-4xl font-black italic uppercase tracking-tight text-white mb-2 group-hover:${p.textColor} transition-colors duration-300 drop-shadow-lg`}>
                {p.title}
              </h3>
              <p className="text-slate-300 text-sm md:text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 max-w-[80%]">
                {p.description}
              </p>
            </div>
            
            {/* Inner glow on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-t ${p.innerGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
