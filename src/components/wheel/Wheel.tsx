import React, { useEffect, useState, useRef, FC } from 'react'
import { IWheelProps, IWheelState } from '../../types'
import { buildWheelConfig, drawWheel } from './'
import './Wheel.css'

const renderingFps = 60

const Wheel:FC<IWheelProps> = ({ levels, winAmount }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const canvas = useRef<HTMLCanvasElement>(null)

  const levelsToRender = levels.slice(currentLevel)
  const currentLevelSectors = levelsToRender[0]?.sectors
  const isCurrentLevelWinning = currentLevelSectors.some(sector => sector.value === winAmount)

  const wheelState: IWheelState = buildWheelConfig(currentLevelSectors, winAmount)

  const startGame = () => setGameStarted(true)

  const renderCanvas = (ctx: CanvasRenderingContext2D) => {
    drawWheel(ctx, levelsToRender, wheelState, currentLevel)

    if (currentLevel === 2) return

    if (gameStarted) {
      if (wheelState.currentStep > wheelState.totalSteps) {
        if (!isCurrentLevelWinning) {
          setCurrentLevel(currentLevel + 1)
          return
        }
        return
      }

      setTimeout(() => {
        requestAnimationFrame(() => renderCanvas(ctx))
      }, 1000 / renderingFps)

      wheelState.currentStep++
    }
  }

  useEffect(() => { document.fonts.ready.then(() => setFontsLoaded(true)) }, [])

  useEffect(() => {
    if (fontsLoaded && canvas.current) {
      const ctx = canvas.current.getContext('2d') as CanvasRenderingContext2D

      renderCanvas(ctx)
    }
  }, [fontsLoaded, currentLevel, gameStarted])

  return (
    <div id="wheel-of-fortune-container">
      {!gameStarted && <div id="play-button" onClick={startGame}> <i className="icofont-spinner-alt-3" /> </div>}
      <canvas ref={canvas} width="800" height="800"></canvas>
    </div>
  )
}

export default Wheel
