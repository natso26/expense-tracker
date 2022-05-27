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
    IniState: () => ({
        state: 'INIT',
        data: undefined,
        error: undefined,
    } as InitState),
    LoadingState: () => ({
        state: 'LOADING',
        data: undefined,
        error: undefined,
    } as LoadingState),
    DataState: <T>(data: T) => ({
        state: 'DATA',
        data: data,
        error: undefined,
    } as DataState<T>),
    ErrorState: (error: any) => ({
        state: 'ERROR',
        data: undefined,
        error: error,
    } as ErrorState),
}