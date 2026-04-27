import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { Loading } from './components/Loading'
import { Hero } from './components/Hero'
import { SelectPersona } from './components/personas/SelectPersona'

export type Persona = 'professional' | 'gamer' | 'casual' | null;

function App() {
  const [appState, setAppState] = useState<'loading' | 'persona' | 'main'>('loading')
  const [selectedPersona, setSelectedPersona] = useState<Persona>(null)

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
    <>
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <Loading key="loading" onComplete={() => setAppState('persona')} />
        )}
        
        {appState === 'persona' && (
          <SelectPersona 
            key="persona" 
            onSelect={(p) => {
              setSelectedPersona(p);
              setAppState('main');
            }} 
          />
        )}
      </AnimatePresence>

      {appState === 'main' && (
        <Hero isLoaded={true} persona={selectedPersona} />
      )}
    </>
  )
}

export default App
