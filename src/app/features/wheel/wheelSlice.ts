import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ConfigState } from '../../types/config'
import { Sector, WheelState, LevelFromServer } from '../../types/wheel'
import { generateFormattedCurrencyString, shufflePrizes } from '../../common/utils'

const initialState: WheelState = {
  levels: [],
  ready: false
}

const wheelSlice = createSlice({
  name: 'wheel',
  initialState,
  reducers: {
    generateWheelData: (state, action: PayloadAction<ConfigState>) => {
      const { levels, locale, currency } = action.payload

      const buildLevelSectorsData: (prizes: number[], i: number) => Sector[] = (prizes) => {
        const tempPrizes = shufflePrizes([...prizes])

        if (tempPrizes.length > 1) tempPrizes.push(0)

        const sectors = tempPrizes.map((value: number) => ({
          value,
          label: generateFormattedCurrencyString(value, locale, currency)
        }))

        return sectors
      }

      const populatedLevels = levels.map((level: LevelFromServer, i: number) => ({ sectors: buildLevelSectorsData(level.prizes, i) }))

      Object.assign(state, { levels: populatedLevels, ready: true })
    }
  }
})

export const { generateWheelData } = wheelSlice.actions
export const getWheelConfig = (state: RootState) => state.wheel

export default wheelSlice.reducer
