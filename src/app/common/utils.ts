export const generateFormattedCurrencyString = (value: number, locale: string, currency: string): string => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency, maximumSignificantDigits: 3 }).format(value)
}

export const shufflePrizes = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

export const pickSectorColor = (value: number, levelIndex: number, prizeIndex: number, levelsLength: number): string => {
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

export const easingFormula = (w: { startAngle: number, endAngle: number, totalSteps: number, currentStep: number }): number => {
  let t = w.currentStep
  const b = w.startAngle
  const d = w.totalSteps
  const c = w.endAngle - w.startAngle
  return (-c * ((t = t / d - 1) * t * t * t - 1) + b + w.startAngle)
}

export const buildFontString = (value: number, levelIndex: number): string => {
  const fontSizePerCurrentLevelIndex = [21, 40, 105]

  if (value === 0) return `bold ${Math.ceil(fontSizePerCurrentLevelIndex[levelIndex] * 1.5)}pt IcoFont`
  return `bold ${fontSizePerCurrentLevelIndex[levelIndex]}pt Helvetica, Arial`
}
