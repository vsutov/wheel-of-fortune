import React, { useEffect, useState, useRef, FC } from 'react'
import { ILevel, ISector, IWheelProps, IWheelConfig } from '../types'
import { pickSectorColor, easingFormula, buildFontString } from '../common/utils'
import './Wheel.css'

const canvasWidth = 800
const canvasHeight = 800
const canvasX = canvasWidth / 2
const canvasY = canvasHeight / 2

const renderingFps = 60

const wheelStyles = {
  circleLineWidthPerLevelIndex: [50, 15, 0.1],
  outerRingColor: '#2e1811',
  primaryColor: '#ff0000'
}

const chevronIconUnicode = '\ueab2'

const Wheel:FC<IWheelProps> = ({ levels: levelsFromConfig, winAmount }) => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [started, setStarted] = useState(false)

  const canvas = useRef<HTMLCanvasElement>(null)

  const startGame = () => {
    setSpinning(true)
    setStarted(true)
  }

  const spinToAngle = (sectors: ISector[]): number => {
    let sectorToSpinToIndex: number

    if (!spinning) return 0

    const sectorMappedValue = (val: number) => sectors.map(sector => sector.value).indexOf(val)

    if (sectorMappedValue(winAmount) < 0) {
      sectorToSpinToIndex = sectorMappedValue(0)
    } else {
      sectorToSpinToIndex = sectorMappedValue(winAmount)
      setSpinning(false)
    }

    const PI2 = Math.PI * 2
    const sectorsSweep = PI2 / sectors.length

    return ((PI2 - sectorsSweep * (sectorToSpinToIndex + 1)) + Math.random() * sectorsSweep - Math.PI / 2)
  }

  const buildWheelConfig = (firstLevelSectors: ISector[]): IWheelConfig => {
    return {
      startAngle: 0,
      endAngle: Math.PI * 4 + spinToAngle(firstLevelSectors),
      totalSteps: 360,
      currentStep: 0
    }
  }

  const drawWheel = (levels: ILevel[]): HTMLCanvasElement => {
    let radius = canvasWidth - 200
    let textRadius = radius / 2

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.height = radius * 2
    const x = radius
    const y = radius
    let arc: number

    if (ctx) {
      levels.forEach((level, levelIndex) => {
        const sectors = level.sectors

        radius = radius / 2
        textRadius = radius / 1.5

        arc = Math.PI / (sectors.length / 2)

        ctx.strokeStyle = wheelStyles.outerRingColor
        ctx.lineWidth = wheelStyles.circleLineWidthPerLevelIndex[levelIndex]
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2, false)
        ctx.stroke()
        ctx.save()

        sectors.forEach((sector, sectorIndex) => {
          const angle = sectorIndex * arc

          ctx.fillStyle = pickSectorColor(sector.value, levelIndex, sectorIndex, levels.length)
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.arc(x, y, radius, angle, angle + arc, false)
          ctx.lineTo(x, y)
          ctx.fill()
          ctx.save()
          ctx.fillStyle = 'white'

          if (levelIndex !== levels.length - 1) {
            ctx.translate(x + Math.cos(angle + arc / 2) * textRadius,
              y + Math.sin(angle + arc / 2) * textRadius)
            ctx.rotate(angle + arc / 2 + Math.PI / 2)
          } else {
            ctx.translate(x, y + (currentLevel + 1) * 10)
          }

          const textValue = sector.label || chevronIconUnicode

          ctx.font = buildFontString(sector.value, currentLevel)
          ctx.fillText(textValue, -ctx.measureText(textValue).width / 2, 0)

          ctx.restore()
        })
      })
    }

    return canvas
  }

  const drawArrow = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 80
    canvas.height = 80
    if (ctx) {
      ctx.fillStyle = wheelStyles.primaryColor
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(80, 0)
      ctx.lineTo(40, 80)
      ctx.fill()
    }

    return canvas
  }

  const drawAll = (ctx: CanvasRenderingContext2D, levels: ILevel[], wheel: IWheelConfig) => {
    if (ctx) {
      const wheelCanvas = drawWheel(levels)
      const arrowCanvas = drawArrow()

      const angle = easingFormula(wheel)
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.translate(canvasX, canvasY)
      ctx.rotate(angle)
      ctx.drawImage(wheelCanvas, -wheelCanvas.width / 2, -wheelCanvas.height / 2)
      ctx.rotate(-angle)
      ctx.translate(-canvasX, -canvasY)
      ctx.drawImage(arrowCanvas, canvasX - arrowCanvas.width / 2, arrowCanvas.height / 2)
    }
  }

  const animate = (ctx: CanvasRenderingContext2D, levels: ILevel[], wheel: IWheelConfig) => {
    if (wheel.currentStep > wheel.totalSteps) {
      setCurrentLevel(currentLevel + 1)
      return
    }
    drawAll(ctx, levels, wheel)

    if (currentLevel !== 2) {
      setTimeout(() => {
        requestAnimationFrame(() => animate(ctx, levels, wheel))
      }, 1000 / renderingFps)

      wheel.currentStep++
    }
  }

  useEffect(() => {
    if (canvas.current) {
      const levels = levelsFromConfig.slice(currentLevel)
      const firstLevelSectors = levels[0].sectors

      const ctx = canvas.current.getContext('2d') as CanvasRenderingContext2D

      const wheel: IWheelConfig = buildWheelConfig(firstLevelSectors)

      document.fonts.ready.then(() => !started && drawAll(ctx, levels, wheel))

      if (spinning) animate(ctx, levels, wheel)
    }
  }, [currentLevel, spinning, started])

  return (
    <div id="wheel-of-fortune-container">
      {!started && <div id="play-button" onClick={startGame}> <i className="icofont-spinner-alt-3" /> </div>}
      <canvas ref={canvas} width={canvasWidth} height={canvasHeight}></canvas>
    </div>
  )
}

export default Wheel
