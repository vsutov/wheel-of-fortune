export const generateFormattedCurrencyString = (value: number, locale: string, currency: string): string => {
  if (value === 0) return 'V'
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency, maximumSignificantDigits: 3 }).format(value)
}

export const shufflePrizes = (arr: number[]): number[] => {
  return arr.reduce(
    (newArr, _, i) => {
      const rand = i + (Math.floor(Math.random() * (newArr.length - i)));
      [newArr[rand], newArr[i]] = [newArr[i], newArr[rand]]
      return newArr
    }, [...arr]
  )
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
