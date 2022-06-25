export type State<T> = InitState | LoadingState | DataState<T> | ErrorState

export type InitState = {
    state: 'INIT',
}

export type LoadingState = {
    state: 'LOADING',
}

export type DataState<T> = {
    state: 'DATA',
    data: T,
}

export type ErrorState = {
    state: 'ERROR',
    error: any,
}

export const StateConstructor = {
    Init: (): InitState => ({
        state: 'INIT',
    }),
    Loading: (): LoadingState => ({
        state: 'LOADING',
    }),
    Data: <T>(data: T): DataState<T> => ({
        state: 'DATA',
        data: data,
    }),
    Error: (error: any): ErrorState => ({
        state: 'ERROR',
        error: error,
    }),
}