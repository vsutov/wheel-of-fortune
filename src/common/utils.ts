export const generateFormattedCurrencyString = (value: number, locale: string, currency: string): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumSignificantDigits: 3 }).format(value)

export const shufflePrizes = (prizes: number[]): number[] => prizes.reduce(
  (newPrizes, _, i) => {
    const rand = i + (Math.floor(Math.random() * (newPrizes.length - i)));
    [newPrizes[rand], newPrizes[i]] = [newPrizes[i], newPrizes[rand]]
    return newPrizes
  }, [...prizes]
)
