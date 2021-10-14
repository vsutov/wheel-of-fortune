import { configureStore } from '@reduxjs/toolkit'
import configReducer from './features/config/configSlice'
import wheelReducer from './features/wheel/wheelSlice'

export const store = configureStore({
  reducer: {
    config: configReducer,
    wheel: wheelReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
