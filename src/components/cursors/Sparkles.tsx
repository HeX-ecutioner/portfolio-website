import { useEffect, useRef } from 'react'
import './Sparkles.css'

type PointerState = {
  x: number
  y: number
  mx: number
  my: number
}

type SparkleArgs = {
  ctx: CanvasRenderingContext2D
  pointer: PointerState
}

const COLORS = ['#ffb700ff', '#ffd700', '#ffe06eff', '#ffffb5ff', '#ffffff']

class Sparkle {
  private ctx: CanvasRenderingContext2D
  private x: number
  private y: number
  private mx: number
  private my: number
  private size: number
  private spread: number
  private spreadX: number
  private spreadY: number
  private color: string
  private rotation: number
  private rotationSpeed: number
  private decay: number
  private life: number // A subtle lifetime value to create a twinkle pattern

  constructor({ ctx, pointer }: SparkleArgs, spread: number, speed: number) {
    this.ctx = ctx
    this.x = pointer.x
    this.y = pointer.y
    this.mx = pointer.mx * 0.1
    this.my = pointer.my * 0.1
    this.size = (Math.random() + 1) * 3 // base size
    this.decay = 0.02
    this.spread = spread * speed * 0.08
    this.spreadX = (Math.random() - 0.5) * this.spread - this.mx
    this.spreadY = (Math.random() - 0.5) * this.spread - this.my
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.05
    this.life = 0
  }

  drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    this.ctx.beginPath()
    this.ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      this.ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      this.ctx.lineTo(x, y)
      rot += step
    }
    this.ctx.lineTo(cx, cy - outerRadius)
    this.ctx.closePath()
  }

  update() {
    this.ctx.save()
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.rotation)

    // Twinkle effect: subtly vary the opacity using a sine wave based on life
    const twinkle = Math.abs(Math.sin(this.life * 0.2)) * 0.5 + 0.5 // range 0.5 - 1.0
    // Occasional subtle sparkle drop to make it look magical
    const sparkleDrop = Math.random() > 0.95 ? 0.3 : 1.0

    this.ctx.globalAlpha = twinkle * sparkleDrop
    this.ctx.fillStyle = this.color
    // 4 point star ("sparkle/magic" shape)
    this.drawStar(0, 0, 4, this.size, this.size / 2)
    this.ctx.fill()
    this.ctx.restore()

    this.x += this.spreadX * this.size * 0.5
    this.y += this.spreadY * this.size * 0.5
    this.size -= this.decay
    this.rotation += this.rotationSpeed
    this.life += 1
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

function Sparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Sparkle[] = []
    const pointer: PointerState = { x: 0, y: 0, mx: 0, my: 0 }

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
        particles.push(new Sparkle({ ctx, pointer }, spread, speed))
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      setPointerValues(event)
      const speed = getPointerVelocity(event.movementX, event.movementY)
      createParticles(10, 1, speed)
    }

    const onClick = (event: MouseEvent) => {
      setPointerValues(event)
      createParticles(100, Math.random() + 50, Math.random() + 1)
    }

    const animateParticles = () => {
      animationFrameId = requestAnimationFrame(animateParticles)

      const now = performance.now()
      const passed = now - previousTime
      if (passed < MS_PER_FRAME) return

      previousTime = now - (passed % MS_PER_FRAME)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

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
    <div className="stars-host" aria-hidden="true">
      <canvas ref={canvasRef} className="stars-canvas" />
    </div>
  )
}

export default Sparkles
