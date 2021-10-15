import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './common/hooks'
import { fetchAndSetConfig, getConfig } from './features/config/configSlice'
import Wheel from './features/wheel/Wheel'

const App = () => {
  const dispatch = useAppDispatch()
  const config = useAppSelector(getConfig)

  useEffect(() => {
    if (!config.ready) {
      dispatch(fetchAndSetConfig())
    }
  }, [config, dispatch])

  return (
    <div className="App">
          {config.ready
            ? <Wheel />
            : 'Loading...'
          }
    </div>
  )
}

export default App
