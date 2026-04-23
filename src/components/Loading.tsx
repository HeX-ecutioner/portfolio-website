import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import aclogo from '../assets/aclogo.png';

export const Loading = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  const texts = [
    "INITIALIZING ANIMUS 1.0...",
    "LOADING MEMORY BLOCK...",
    "SYNCHRONIZING DNA...",
    "ACCESSING GENETIC MEMORY..."
  ];

  useEffect(() => {
    // 3 seconds to reach 100% (100 steps of 30ms)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const zoomTimer = setTimeout(() => {
        setIsZooming(true);
      }, 200);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1800); // 1.6s total to let the morph finish

      return () => {
        clearTimeout(zoomTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  useEffect(() => {
    // Text cycling
    const textInterval = setInterval(() => {
      setTextIndex(i => (i + 1) % texts.length);
    }, 1500);
    return () => clearInterval(textInterval);
  }, [texts.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (canvas) {
          if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
          if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(125, 211, 252, 0.6)'; // sky-300
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      if (!canvas) return;
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Opacity fades out as distance increases
            ctx.strokeStyle = `rgba(125, 211, 252, ${0.4 * (1 - distance / 180)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Dynamic Background Gradient */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={isZooming ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background: 'radial-gradient(circle at center, #0c4a6e 0%, #020617 80%)' // Dark Animus void
        }}
      />
      
      <motion.canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10" 
        animate={isZooming ? { opacity: 0, scale: 1.5 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Subtle Scanline/Glitch Overlay */}
      <motion.div 
        className="absolute inset-0 z-10 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mix-blend-overlay"
        animate={isZooming ? { opacity: 0 } : { opacity: 0.03 }}
        transition={{ duration: 0.5 }}
      />

      {/* Vignette */}
      <motion.div 
        className="absolute inset-0 z-10 shadow-[inset_0_0_250px_rgba(2,6,23,0.9)]" 
        animate={isZooming ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-20 flex flex-col items-center">
        {/* Assassin's Creed Logo */}
        <motion.div 
          className="w-56 h-56 md:w-72 md:h-72 mb-20 relative flex items-center justify-center pointer-events-auto cursor-pointer group z-50"
          animate={isZooming ? { 
            scale: 200, 
            opacity: [1, 1, 0], 
            filter: ['brightness(1) blur(0px)', 'brightness(3) blur(2px)', 'brightness(10) blur(12px)'] 
          } : { scale: 1, opacity: 1, filter: 'brightness(1) blur(0px)' }}
          transition={{ duration: 1.5, ease: "easeIn", opacity: { times: [0, 0.8, 1] } }}
        >
          <img 
            src={aclogo} 
            alt="AC Logo" 
            className="w-full h-full object-contain brightness-0 invert transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(56,189,248,0.8)]" 
          />
        </motion.div>

        <motion.div 
          className="text-center font-mono tracking-[0.4em]"
          animate={isZooming ? { opacity: 0, scale: 0.9, y: 30 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={textIndex}
              initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="text-xl md:text-3xl font-bold mb-8 relative text-slate-200 uppercase tracking-[0.3em]"
            >
              <span className="relative z-10">{texts[textIndex]}</span>
              {/* Subtle glitch shadows */}
              <span className="absolute inset-0 z-0 opacity-40 transform translate-x-[1px] text-sky-400 select-none">{texts[textIndex]}</span>
              <span className="absolute inset-0 z-0 opacity-40 transform translate-x-[-1px] text-slate-400 select-none">{texts[textIndex]}</span>
            </motion.div>
          </AnimatePresence>

          {/* Glitchy Progress Bar */}
          <div className="w-80 md:w-96 h-[3px] bg-slate-800 mt-10 relative overflow-hidden mx-auto">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,1)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
          <div className="mt-6 text-sm md:text-base font-bold text-slate-400 tracking-widest opacity-80">
            [ {Math.floor(Math.min(progress, 100))} % ]
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
