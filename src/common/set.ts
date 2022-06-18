export const setAddAll = <T>(a: Set<T>, b: Set<T>): Set<T> => {
    for (const e of b) {
        a.add(e)
    }

    return a
}

export const setDifference = <T>(a: Set<T>, b: Set<T>): Set<T> => {
    const difference = new Set<T>()

    for (const e of a) {
        b.has(e) || difference.add(e)
    }

    return difference
}