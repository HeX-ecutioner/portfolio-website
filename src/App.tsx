import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { Loading } from './components/Loading'
import { Hero } from './components/Hero'

function App() {
  const [isLoading, setIsLoading] = useState(true)
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
      <AnimatePresence>
        {isLoading && <Loading onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Hero isLoaded={!isLoading} />
    </>
  )
}

export default App
