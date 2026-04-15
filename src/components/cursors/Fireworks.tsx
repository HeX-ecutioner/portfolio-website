import { useEffect, useRef } from 'react'
import './Fireworks.css'

type PointerState = {
  x: number
  y: number
  mx: number
  my: number
}

type FireworkParticleArgs = {
  ctx: CanvasRenderingContext2D
  pointer: PointerState
  hue: number
}

class FireworkParticle {
  private ctx: CanvasRenderingContext2D
  private x: number
  private y: number
  private mx: number
  private my: number
  private size: number
  private decay: number
  private spread: number
  private spreadX: number
  private spreadY: number
  private color: string

  constructor({ ctx, pointer, hue }: FireworkParticleArgs, spread: number, speed: number) {
    this.ctx = ctx
    this.x = pointer.x
    this.y = pointer.y
    this.mx = pointer.mx * 0.1
    this.my = pointer.my * 0.1
    this.size = Math.random() + 1
    this.decay = 0.01
    this.spread = spread * speed * 0.08
    this.spreadX = (Math.random() - 0.5) * this.spread - this.mx
    this.spreadY = (Math.random() - 0.5) * this.spread - this.my
    this.color = `hsl(${hue}deg 90% 60%)`
  }

  update() {
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
    this.x += this.spreadX * this.size
    this.y += this.spreadY * this.size
    this.size -= this.decay
  }

  isAlive() {
    return this.size > 0.1
  }
}

const FPS = 60
const MS_PER_FRAME = 1000 / FPS

function getPointerVelocity(movementX: number, movementY: number) {
  return Math.floor(Math.sqrt(movementX * movementX + movementY * movementY))
}

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: FireworkParticle[] = []
    const pointer: PointerState = { x: 0, y: 0, mx: 0, my: 0 }

    let hue = 0
    let previousTime = performance.now()
    let animationFrameId = 0

    const setCanvasDimensions = () => {
      const ratio = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const setPointerValues = (event: PointerEvent | MouseEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.mx = 'movementX' in event ? event.movementX : 0
      pointer.my = 'movementY' in event ? event.movementY : 0
    }

    const createParticles = (count: number, spread: number, speed: number) => {
      for (let i = 0; i < count; i++) {
        particles.push(new FireworkParticle({ ctx, pointer, hue }, spread, speed))
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      setPointerValues(event)
      const speed = getPointerVelocity(event.movementX, event.movementY)
      createParticles(20, 1, speed)
    }

    const onClick = (event: MouseEvent) => {
      setPointerValues(event)
      createParticles(300, Math.random() + 50, Math.random() + 1)
    }

    const animateParticles = () => {
      animationFrameId = requestAnimationFrame(animateParticles)

      const now = performance.now()
      const passed = now - previousTime
      if (passed < MS_PER_FRAME) return

      previousTime = now - (passed % MS_PER_FRAME)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      hue = hue > 360 ? 0 : hue + 3

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update()
        if (!particles[i].isAlive()) {
          particles.splice(i, 1)
        }
      }
    }

    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('click', onClick)
    animationFrameId = requestAnimationFrame(animateParticles)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', setCanvasDimensions)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="fireworks-host" aria-hidden="true">
      <canvas ref={canvasRef} className="fireworks-canvas" />
    </div>
  )
}

export default Fireworks