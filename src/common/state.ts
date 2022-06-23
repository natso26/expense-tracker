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
    IniState: (): InitState => ({
        state: 'INIT',
    }),
    LoadingState: (): LoadingState => ({
        state: 'LOADING',
    }),
    DataState: <T>(data: T): DataState<T> => ({
        state: 'DATA',
        data: data,
    }),
    ErrorState: (error: any): ErrorState => ({
        state: 'ERROR',
        error: error,
    }),
}