export type GetSet<T> = {
    get: () => T,
    set: (value: T) => void,
}