import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ConfigState } from '../../types/config'
import { fetchConfigRequest } from '../../api'

const initialState: ConfigState = {
  levels: [],
  winAmount: 0,
  ready: false,
  locale: 'et-EE',
  currency: 'EUR'
}

export const fetchConfig = createAsyncThunk(
  'config/fetch',
  async () => {
    const response = await fetchConfigRequest()
    return response
  }
)

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      Object.assign(state, { ...action.payload, ready: true })
    })
  }
})

export const getConfig = (state: RootState) => state.config
export const getWinAmount = (state: RootState) => state.config.winAmount

export default configSlice.reducer
