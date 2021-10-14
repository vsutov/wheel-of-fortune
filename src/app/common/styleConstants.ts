import { WheelStyles } from '../types/wheel'

export const wheelStyles: WheelStyles = {
  circleLineWidthPerLevelIndex: [50, 15, 0.1],
  fontSizePerCurrentLevelIndex: [21, 40, 105],
  outerRingColor: '#2e1811',
  primaryColor: '#ff0000',
  levelColors: [
    {
      primary: '#757575',
      secondary: '#C9C9C9',
      accent: ''
    },
    {
      primary: '#727170',
      secondary: '#a3a3a3',
      accent: '#515151'
    },
    {
      primary: '',
      secondary: '',
      accent: '#333333'
    }
  ]
}
