export const generateFormattedCurrencyString = (value: number, locale: string, currency: string): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumSignificantDigits: 3 }).format(value)

export const shufflePrizes = (prizes: number[]): number[] => prizes.reduce(
  (newPrizes, _, i) => {
    const rand = i + (Math.floor(Math.random() * (newPrizes.length - i)));
    [newPrizes[rand], newPrizes[i]] = [newPrizes[i], newPrizes[rand]]
    return newPrizes
  }, [...prizes]
)

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

interface IEasingFormulaParams {
  startAngle: number,
  endAngle: number,
  totalSteps: number,
  currentStep: number
}

export const easingFormula = ({ startAngle, endAngle, totalSteps, currentStep }: IEasingFormulaParams): number => {
  let cs = currentStep

  return (-(endAngle - startAngle) * ((cs = cs / totalSteps - 1) * cs * cs * cs - 1) + (startAngle * 2))
}

export const buildFontString = (value: number, levelIndex: number): string => {
  const fontSizePerCurrentLevelIndex = [21, 40, 105]

  if (value === 0) return `bold ${Math.ceil(fontSizePerCurrentLevelIndex[levelIndex] * 1.5)}pt IcoFont`
  return `bold ${fontSizePerCurrentLevelIndex[levelIndex]}pt Helvetica, Arial`
}
