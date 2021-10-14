import { LevelFromServer } from './wheel'

export interface ConfigFromServer {
    levels: LevelFromServer[];
    winAmount: number,
    locale: string,
    currency: string
}

export interface ConfigState extends ConfigFromServer {
    ready: boolean
}
