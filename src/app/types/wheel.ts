export interface Sector {
    value: number,
    label: string,
}

export interface LevelFromServer {
    prizes: number[],
}

export interface Level {
    sectors: Sector[]
}

export interface LevelColor {
    primary: string,
    secondary: string,
    accent: string
}

export interface WheelStyles {
    circleLineWidthPerLevelIndex: number[],
    fontSizePerCurrentLevelIndex: number[],
    outerRingColor: string,
    primaryColor: string,
    levelColors: LevelColor[]
}

export interface WheelState {
    ready: boolean,
    levels: Level[]
}
