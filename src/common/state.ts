export type State<T> = {
    state: 'INIT',
} | {
    state: 'LOADING',
} | {
    state: 'DATA',
    data: T,
} | {
    state: 'ERROR',
    error: any,
}

export const StateConstructor = {
    Init: <T>(): State<T> => ({
        state: 'INIT',
    }),
    Loading: <T>(): State<T> => ({
        state: 'LOADING',
    }),
    Data: <T>(data: T): State<T> => ({
        state: 'DATA',
        data: data,
    }),
    Error: <T>(error: any): State<T> => ({
        state: 'ERROR',
        error: error,
    }),
}