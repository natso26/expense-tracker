import {makeCache} from "./cache";
import {PromiseOr, wrapFuncWithPromiseOr} from "./promise-or";

export const cachedFunction = <T>(func: () => PromiseOr<T>): () => PromiseOr<T> => {
    const cache = makeCache<T>()

    const setCacheAndPassthrough = wrapFuncWithPromiseOr((value: T) => {
        cache.set(value)

        return value
    })

    return () => {
        const cacheState = cache.get()

        if (cacheState.hasValue) return cacheState.value

        return setCacheAndPassthrough(func())
    }
}

export const cachedFunctionSync = <T>(func: () => T): () => T => {
    const cache = makeCache<T>()

    return () => {
        const cacheState = cache.get()

        if (cacheState.hasValue) return cacheState.value

        const value = func()

        cache.set(value)

        return value
    }
}