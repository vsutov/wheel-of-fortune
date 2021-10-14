import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../common/hooks'
import { Level } from '../../types/wheel'
import { getWheelConfig } from './wheelSlice'
import { wheelStyles } from '../../common/styleConstants'
import { pickSectorColor } from '../../common/utils'
import { getWinAmount } from '../config/configSlice'

const Wheel = () => {
  const wheelConfig = useAppSelector(getWheelConfig)
  const winAmount = useAppSelector(getWinAmount)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const { circleLineWidthPerLevelIndex, fontSizePerCurrentLevelIndex, outerRingColor, primaryColor } = wheelStyles

    const canvas = document.getElementById('wheel') as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const cw = canvas.width
    const ch = canvas.height
    const cx = cw / 2
    const cy = ch / 2

    const levels = wheelConfig.levels.slice(currentLevel)
    const firstLevelSectors = levels[0].sectors

    const calculateSpin = () => {
      let sectorToSpinToIndex: number

      if (!spinning) return 0

      if (firstLevelSectors.map(sector => sector.value).indexOf(winAmount) < 0) {
        sectorToSpinToIndex = firstLevelSectors.map(sector => sector.value).indexOf(0)
      } else {
        sectorToSpinToIndex = firstLevelSectors.map(sector => sector.value).indexOf(winAmount)
        setSpinning(false)
      }

      const PI2 = Math.PI * 2
      const sectorsSweep = PI2 / firstLevelSectors.length

      return ((PI2 - sectorsSweep * (sectorToSpinToIndex + 1)) + Math.random() * sectorsSweep - Math.PI / 2)
    }

    const drawWheel = (levels: Level[]) => {
      let radius = cw - 200
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

        ctx.font = `bold ${fontSizePerCurrentLevelIndex[currentLevel]}pt Helvetica, Arial`
        ctx.strokeStyle = outerRingColor
        ctx.lineWidth = circleLineWidthPerLevelIndex[levelIndex]
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

    const drawArrow = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      canvas.width = 80
      canvas.height = 80
      ctx.fillStyle = primaryColor
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(80, 0)
      ctx.lineTo(40, 80)
      ctx.fill()

      console.log('asd')
      return canvas
    }

    const wheel = {
      startAngle: 0,
      endAngle: Math.PI * 4 + calculateSpin(),
      totalSteps: 360,
      currentStep: 0
    }

    const easingFormula = () => {
      let t = wheel.currentStep
      const b = wheel.startAngle
      const d = wheel.totalSteps
      const c = wheel.endAngle - wheel.startAngle
      return (-c * ((t = t / d - 1) * t * t * t - 1) + b + wheel.startAngle)
    }

    const drawAll = () => {
      const wheelCanvas = drawWheel(levels)
      const arrowCanvas = drawArrow()

      const angle = easingFormula()
      ctx.clearRect(0, 0, cw, ch)
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.drawImage(wheelCanvas, -wheelCanvas.width / 2, -wheelCanvas.height / 2)
      ctx.rotate(-angle)
      ctx.translate(-cx, -cy)
      ctx.drawImage(arrowCanvas, cx - arrowCanvas.width / 2, arrowCanvas.height / 2)
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
  }, [currentLevel, wheelConfig.levels, winAmount, spinning, started])

  return (
        <div id="wheelOfFortune">
            <canvas id="wheel" width="800px" height="800px"></canvas>
            {!started
              ? <button onClick={() => {
                setSpinning(true)
                setStarted(true)
              }}>Spin</button>
              : null}

        </div>
  )
}

export default Wheel
