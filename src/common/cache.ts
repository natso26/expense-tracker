export type Cache<T> = {
    get: () => CacheState<T>,
    set: (value: T) => void,
    clear: () => void,
}

export type CacheState<T> = CacheEmptyState | CacheValueState<T>

export type CacheEmptyState = {
    hasValue: false,
}

export type CacheValueState<T> = {
    hasValue: true,
    value: T,
}

export const makeCache = <T>(): Cache<T> => {
    let state: CacheState<T> = {
        hasValue: false,
    }

    return {
        get: () => state,
        set: (value) => {
            state = {
                hasValue: true,
                value,
            }
        },
        clear: () => {
            state = {
                hasValue: false,
            }
        },
    }
}