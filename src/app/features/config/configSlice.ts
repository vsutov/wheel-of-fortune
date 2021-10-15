import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IConfigFromServer, IConfigState, ILevelFromServer, ISector } from '../../types'
import { fetchConfigRequest } from '../../api'
import { generateFormattedCurrencyString, shufflePrizes } from '../../common/utils'

const initialState: IConfigState = {
  levels: [],
  winAmount: 0,
  ready: false
}

const buildLevelSectorsData: (prizes: number[], locale: string, currency: string) => ISector[] = (prizes, locale, currency) => {
  const tempPrizes = shufflePrizes([...prizes])

  if (tempPrizes.length > 1) tempPrizes.push(0)

  const sectors = tempPrizes.map((value: number): ISector => ({
    value,
    ...(value !== 0 && { label: generateFormattedCurrencyString(value, locale, currency) })
  }))

  return sectors
}

export const fetchAndSetConfig = createAsyncThunk(
  'config/fetch',
  async () => {
    const response: IConfigFromServer = await fetchConfigRequest()

    const { levels: levelsFromServer, locale, currency, winAmount } = response

    const levels = levelsFromServer.map((level: ILevelFromServer) => ({ sectors: buildLevelSectorsData(level.prizes, locale, currency) }))

    return { levels, winAmount }
  }
)

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetConfig.fulfilled, (state, action) => {
      Object.assign(state, { ...action.payload, ready: true })
    })
  }
})

export const getConfig = (state: RootState) => state.config

export default configSlice.reducer
