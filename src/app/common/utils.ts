import { wheelStyles } from '../common/styleConstants'

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
  const { levelColors } = wheelStyles

  if (levelIndex === levelsLength - 1) return levelColors[2].accent

  if (levelIndex === levelsLength - 2 && value === 0) return levelColors[1].accent

  return prizeIndex & 1 ? levelColors[levelIndex].primary : levelColors[levelIndex].secondary
}
