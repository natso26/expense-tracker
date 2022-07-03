export type Cache<T> = {
    get: () => CacheState<T>,
    set: (value: T) => void,
    clear: () => void,
}

export type CacheState<T> = {
    hasValue: false,
} | {
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