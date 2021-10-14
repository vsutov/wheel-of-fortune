import { ConfigFromServer } from './types/config'

export const fetchConfigRequest = (): Promise<ConfigFromServer> => {
  return new Promise((resolve) => {
    resolve({
      levels: [
        {
          prizes: [1, 2, 3, 4, 5, 5, 6, 6, 8]
        },
        {
          prizes: [9, 10, 11, 15]
        },
        {
          prizes: [23]
        }
      ],
      winAmount: 23,
      currency: 'EUR',
      locale: 'et-EE'
    })
  })
}
