export type Cache<T> = {
    get: () => CacheState<T>,
    set: (value: T) => void,
    clear: () => void,
}

export type CacheState<T> = CacheEmptyState | CacheValueState<T>

export type CacheEmptyState = {
    value: undefined,
    hasValue: false,
}

export type CacheValueState<T> = {
    value: T,
    hasValue: true,
}

export const makeCache = <T>(): Cache<T> => {
    let state: CacheState<T> = {
        value: undefined,
        hasValue: false,
    }

    return {
        get: () => state,
        set: (value) => {
            state = {
                value,
                hasValue: true,
            }
        },
        clear: () => {
            state = {
                value: undefined,
                hasValue: false,
            }
        },
    }
}