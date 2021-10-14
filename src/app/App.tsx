import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './common/hooks'
import { fetchConfig, getConfig } from './features/config/configSlice'
import { generateWheelData, getWheelConfig } from './features/wheel/wheelSlice'
import Wheel from './features/wheel/Wheel'

const App = () => {
  const dispatch = useAppDispatch()
  const config = useAppSelector(getConfig)
  const wheelConfig = useAppSelector(getWheelConfig)

  useEffect(() => {
    if (config.ready) {
      dispatch(generateWheelData(config))
    } else {
      dispatch(fetchConfig())
    }
  }, [config, dispatch])

  return (
    <div className="App">
          {wheelConfig.ready
            ? <Wheel />
            : 'Loading...'
          }
    </div>
  )
}

export default App
