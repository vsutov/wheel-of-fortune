import React, { useEffect, useState, useRef } from 'react'
import { useAppSelector } from '../../common/hooks'
import { ILevel, ISector } from '../../types'
import { pickSectorColor, easingFormula } from '../../common/utils'
import { getConfig } from '../config/configSlice'

const Wheel = () => {
  const config = useAppSelector(getConfig)

  const [currentLevel, setCurrentLevel] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [started, setStarted] = useState(false)

  const canvas = useRef<HTMLCanvasElement>(null)

  const canvasWidth = 800
  const canvasHeight = 800
  const canvasX = canvasWidth / 2
  const canvasY = canvasHeight / 2

  const wheelStyles = {
    circleLineWidthPerLevelIndex: [50, 15, 0.1],
    fontSizePerCurrentLevelIndex: [21, 40, 105],
    outerRingColor: '#2e1811',
    primaryColor: '#ff0000'
  }

  const startGame = () => {
    setSpinning(true)
    setStarted(true)
  }

  const spinToAngle = (sectors: ISector[]): number => {
    let sectorToSpinToIndex: number

    if (!spinning) return 0

    if (sectors.map(sector => sector.value).indexOf(config.winAmount) < 0) {
      sectorToSpinToIndex = sectors.map(sector => sector.value).indexOf(0)
    } else {
      sectorToSpinToIndex = sectors.map(sector => sector.value).indexOf(config.winAmount)
      setSpinning(false)
    }

    const PI2 = Math.PI * 2
    const sectorsSweep = PI2 / sectors.length

    return ((PI2 - sectorsSweep * (sectorToSpinToIndex + 1)) + Math.random() * sectorsSweep - Math.PI / 2)
  }

  const drawWheel = (levels: ILevel[]): HTMLCanvasElement => {
    let radius = canvasWidth - 200
    let textRadius = radius / 2

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = canvas.height = radius * 2
    const x = radius
    const y = radius
    let arc: number

    levels.forEach((level, levelIndex) => {
      const sectors = level.sectors

      radius = radius / 2
      textRadius = radius / 1.5

      arc = Math.PI / (sectors.length / 2)

      ctx.font = `bold ${wheelStyles.fontSizePerCurrentLevelIndex[currentLevel]}pt Helvetica, Arial`
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

        ctx.fillText(sector.label, -ctx.measureText(sector.label).width / 2, 0)
        ctx.restore()
      })
    })

    return canvas
  }

  const drawArrow = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = 80
    canvas.height = 80
    ctx.fillStyle = wheelStyles.primaryColor
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(80, 0)
    ctx.lineTo(40, 80)
    ctx.fill()

    return canvas
  }

  useEffect(() => {
    console.log(config)
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d') as CanvasRenderingContext2D
      const levels = config.levels.slice(currentLevel)
      const firstLevelSectors = levels[0].sectors

      const wheel = {
        startAngle: 0,
        endAngle: Math.PI * 4 + spinToAngle(firstLevelSectors),
        totalSteps: 360,
        currentStep: 0
      }

      const drawAll = () => {
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

      const animate = () => {
        if (wheel.currentStep > wheel.totalSteps) {
          setCurrentLevel(currentLevel + 1)
          return
        }
        drawAll()

        if (currentLevel !== 2) {
          requestAnimationFrame(animate)
          wheel.currentStep++
        }
      }

      if (!started) drawAll()
      if (spinning) animate()
    }
  }, [currentLevel, config, spinning, started])

  return (
    <div id="wheelOfFortune">
      <canvas ref={canvas} width={canvasWidth} height={canvasHeight}></canvas>

      {!started
        ? <button onClick={startGame}>Spin</button>
        : null
      }

    </div>
  )
}

export default Wheel
