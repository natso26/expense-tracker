export type State<T> = InitState | LoadingState | DataState<T> | ErrorState

export type InitState = {
    state: 'INIT',
    data: undefined,
    error: undefined,
}

export type LoadingState = {
    state: 'LOADING',
    data: undefined,
    error: undefined,
}

export type DataState<T> = {
    state: 'DATA',
    data: T,
    error: undefined,
}

export type ErrorState = {
    state: 'ERROR',
    data: undefined,
    error: any,
}

export const StateConstructor = {
    IniState: (): InitState => ({
        state: 'INIT',
        data: undefined,
        error: undefined,
    }),
    LoadingState: (): LoadingState => ({
        state: 'LOADING',
        data: undefined,
        error: undefined,
    }),
    DataState: <T>(data: T): DataState<T> => ({
        state: 'DATA',
        data: data,
        error: undefined,
    }),
    ErrorState: (error: any): ErrorState => ({
        state: 'ERROR',
        data: undefined,
        error: error,
    }),
}