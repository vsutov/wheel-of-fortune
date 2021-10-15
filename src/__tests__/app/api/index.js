import { fetchConfigRequest } from '../../../app/api'

describe('API', () => {
  it('fetchConfigRequest returns mocked api response', () => {
    const expectedResponse = {
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
    }
    expect(fetchConfigRequest()).resolves.toStrictEqual(expectedResponse)
  })
})
