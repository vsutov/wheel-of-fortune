import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './common/hooks'
import { fetchAndSetConfig, getConfig } from './features/config/configSlice'
import Wheel from './features/wheel/Wheel'
import './App.css'

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
            ? <Wheel levels={config.levels} winAmount={config.winAmount} />
            : 'Loading...'
          }
    </div>
  )
}

export default App
