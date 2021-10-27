export interface IConfigFromServer {
    levels: ILevelFromServer[],
    winAmount: number,
    locale: string,
    currency: string
}

export interface ILevelFromServer {
    prizes: number[]
}

export interface ISector {
    value: number,
    label?: string
}

export interface ILevel {
    sectors: ISector[]
}

export interface IWheelProps {
    levels: ILevel[],
    winAmount: number
}

export interface IWheelState {
    startAngle: number,
    endAngle: number,
    totalSteps: number,
    currentStep: number
}

export interface IConfigState extends Omit<IConfigFromServer, 'levels'|'locale'|'currency'> {
    ready: boolean,
    levels: ILevel[]
}
