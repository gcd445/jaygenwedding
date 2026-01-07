<script setup lang="ts">
import { createNoise3D } from 'simplex-noise'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

interface WavyBackgroundProps {
  class?: string
  containerClass?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: 'slow' | 'fast'
  waveOpacity?: number
  [key: string]: any
}

const DEFAULT_COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee']
const DEFAULT_WAVE_WIDTH = 50
const DEFAULT_BACKGROUND_FILL = 'black'
const DEFAULT_BLUR = 10
const DEFAULT_SPEED: WavyBackgroundProps['speed'] = 'fast'
const DEFAULT_WAVE_OPACITY = 0.5

const props = defineProps<WavyBackgroundProps>()

const noise = createNoise3D()

function getWaveColors(): string[] {
  const colors = props.colors ?? DEFAULT_COLORS
  if (colors.length === 0) {
    return DEFAULT_COLORS
  }
  return colors
}

function getWaveWidth(): number {
  return props.waveWidth ?? DEFAULT_WAVE_WIDTH
}

function getBlurValue(): number {
  return props.blur ?? DEFAULT_BLUR
}

function getWaveOpacity(): number {
  return props.waveOpacity ?? DEFAULT_WAVE_OPACITY
}

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')

// Declare variables with null
let w = 0
let h = 0
let nt = 0
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | undefined
let resizeHandler: (() => void) | null = null

function getSpeed(): number {
  const speed = props.speed ?? DEFAULT_SPEED
  return speed === 'slow' ? 0.001 : 0.002
}

function init() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const parent = canvas.parentElement

  const updateSize = () => {
    if (!parent || !ctx) {
      return
    }
    w = ctx.canvas.width = parent.clientWidth
    h = ctx.canvas.height = parent.clientHeight
  }

  updateSize()
  ctx.filter = `blur(${getBlurValue()}px)`

  resizeHandler = () => {
    if (!ctx || !parent) {
      return
    }
    updateSize()
    ctx.filter = `blur(${getBlurValue()}px)`
  }

  if (typeof window !== 'undefined' && resizeHandler) {
    window.addEventListener('resize', resizeHandler)
  }

  render()
}

function drawWave(n: number) {
  const context = ctx
  if (!context) {
    return
  }

  nt += getSpeed()
  const waveWidth = getWaveWidth()
  const waveColors = getWaveColors()
  for (let i = 0; i < n; i++) {
    context.beginPath()
    context.lineWidth = waveWidth
    const safeWaveColors = waveColors.length > 0 ? waveColors : DEFAULT_COLORS
    const colorIndex = i % safeWaveColors.length
    const strokeColor = safeWaveColors[colorIndex]!
    context.strokeStyle = strokeColor
    for (let x = 0; x < w; x += 5) {
      const y = noise(x / 800, 0.3 * i, nt) * 100
      context.lineTo(x, y + h * 0.5) // Adjust for height, at 50% of the container
    }
    context.stroke()
    context.closePath()
  }
}

function render() {
  if (!ctx) {
    return
  }

  const fillStyle: string = props.backgroundFill ?? DEFAULT_BACKGROUND_FILL
  ctx.fillStyle = fillStyle
  ctx.globalAlpha = getWaveOpacity()
  ctx.fillRect(0, 0, w, h)
  drawWave(5)
  animationId = requestAnimationFrame(render)
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }

  if (animationId !== undefined) {
    cancelAnimationFrame(animationId)
  }
})

const isSafari = ref(false)
onMounted(() => {
  isSafari.value =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')

  init()
})
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center" :class="[props.containerClass]">
    <canvas
      id="canvas"
      ref="canvasRef"
      class="absolute z-0"
      :style="{ filter: isSafari ? `blur(${getBlurValue()}px)` : undefined }"
    />
    <div class="relative z-10" :class="[props.class]">
      <slot />
    </div>
  </div>
</template>
