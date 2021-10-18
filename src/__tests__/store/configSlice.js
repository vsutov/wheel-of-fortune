import reducer, { fetchAndSetConfig } from '../../../app/store/configSlice'
import thunkPayload from '../../../__mocks__/thunkPayload'

describe('configSlice', () => {
  it('returns initial state', () => {
    const expectedInitialState = {
      levels: [],
      winAmount: 0,
      ready: false
    }

    const receivedInitialState = reducer(undefined, {})

    expect(receivedInitialState).toStrictEqual(expectedInitialState)
  })

  it('fetches data from API and populates config', async () => {
    const fetchConfigThunk = {
      type: fetchAndSetConfig.fulfilled,
      payload: thunkPayload
    }

    const receivedState = reducer(undefined, fetchConfigThunk)

    expect(receivedState).toStrictEqual({ ...thunkPayload, ready: true })
  })
})
