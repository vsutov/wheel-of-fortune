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

export interface IConfigState extends Omit<IConfigFromServer, 'levels'|'locale'|'currency'> {
    ready: boolean,
    levels: ILevel[]
}
