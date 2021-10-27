import { ILevel, ISector, IWheelState } from '../../types'

const canvasWidthAndHeight = 800

interface IEasingFormulaParams {
    startAngle: number,
    endAngle: number,
    totalSteps: number,
    currentStep: number
}

const easingFormula = ({ startAngle, endAngle, totalSteps, currentStep }: IEasingFormulaParams): number => {
  let cs = currentStep

  return (-(endAngle - startAngle) * ((cs = cs / totalSteps - 1) * Math.pow(cs, 3) - 1) + (startAngle * 2))
}

const buildFontString = (value: number, levelIndex: number): string => {
  const fontSizePerCurrentLevelIndex = [21, 40, 105]

  if (value === 0) return `bold ${Math.ceil(fontSizePerCurrentLevelIndex[levelIndex] * 1.5)}pt IcoFont`
  return `bold ${fontSizePerCurrentLevelIndex[levelIndex]}pt Helvetica, Arial`
}

const pickSectorColor = (value: number, levelIndex: number, prizeIndex: number, levelsLength: number): string => {
  const levelColors = [
    {
      primary: '#757575',
      secondary: '#C9C9C9'
    },
    {
      primary: '#727170',
      secondary: '#a3a3a3'
    }
  ]
  if (levelIndex === levelsLength - 1) return '#333333'

  if (levelIndex === levelsLength - 2 && value === 0) return '#515151'

  return prizeIndex & 1 ? levelColors[levelIndex].primary : levelColors[levelIndex].secondary
}

const winningSectorAngleOffset = (sectors: ISector[], winAmount: number): number => {
  let sectorToSpinToIndex: number

  const sectorMappedValue = (val: number) => sectors.map(sector => sector.value).indexOf(val)

  if (sectorMappedValue(winAmount) < 0) {
    sectorToSpinToIndex = sectorMappedValue(0)
  } else {
    sectorToSpinToIndex = sectorMappedValue(winAmount)
  }

  const PI2 = Math.PI * 2
  const sectorsSweep = PI2 / sectors.length

  return ((PI2 - sectorsSweep * (sectorToSpinToIndex + 1)) + Math.random() * sectorsSweep - Math.PI / 2)
}

const drawLevels = (levels: ILevel[], currentLevel: number): HTMLCanvasElement => {
  let radius = canvasWidthAndHeight - 200
  let textRadius = radius / 2

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = canvas.height = radius * 2
  const x = radius
  const y = radius
  let arc: number

  const circleLineWidthPerLevelIndex = [50, 15, 0.1]
  const outerRingColor = '#2e1811'

  const chevronIconUnicode = '\ueab2'

  if (ctx) {
    levels.forEach((level, levelIndex) => {
      const sectors = level.sectors

      radius = radius / 2
      textRadius = radius / 1.5

      arc = Math.PI / (sectors.length / 2)

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
  const arrowColor = '#ff0000'
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 80
  canvas.height = 80

  if (ctx) {
    ctx.fillStyle = arrowColor
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(80, 0)
    ctx.lineTo(40, 80)
    ctx.fill()
  }

  return canvas
}

export const drawWheel = (ctx: CanvasRenderingContext2D, levels: ILevel[], wheelState: IWheelState, currentLevel: number) => {
  const centerOfCanvas = canvasWidthAndHeight / 2

  const wheelCanvas = drawLevels(levels, currentLevel)
  const arrowCanvas = drawArrow()

  const angle = easingFormula(wheelState)
  ctx.clearRect(0, 0, canvasWidthAndHeight, canvasWidthAndHeight)
  ctx.translate(centerOfCanvas, centerOfCanvas)
  ctx.rotate(angle)
  ctx.drawImage(wheelCanvas, -wheelCanvas.width / 2, -wheelCanvas.height / 2)
  ctx.rotate(-angle)
  ctx.translate(-centerOfCanvas, -centerOfCanvas)
  ctx.drawImage(arrowCanvas, centerOfCanvas - arrowCanvas.width / 2, arrowCanvas.height / 2)
}

export const buildWheelConfig = (currentLevelSectors: ISector[], winAmount: number): IWheelState => {
  return {
    startAngle: 0,
    endAngle: Math.PI * 4 + winningSectorAngleOffset(currentLevelSectors, winAmount),
    totalSteps: 360,
    currentStep: 0
  }
}
