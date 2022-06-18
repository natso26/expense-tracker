import {setAddAll, setDifference} from "./set";

export type Graph<V> = Map<V, Set<V>>

export const reverseGraph = <V>(input: Graph<V>): Graph<V> => {
    const reversed = new Map<V, Set<V>>()

    for (const [k, vs] of input) {
        for (const v of vs) {
            reversed.set(v, (reversed.get(v) ?? new Set()).add(k))
        }
    }

    return reversed
}

export const transitiveClosure = <V>(input: Graph<V>): Graph<V> => {
    const closure = new Map<V, Set<V>>()
    let active = new Map<V, Set<V>>()

    for (const [k, vs] of input) {
        closure.set(k, new Set(vs))
        active.set(k, new Set(vs))
    }

    while (true) {
        let updated = false
        const newActive = new Map<V, Set<V>>()

        for (const [k, vs] of active) {
            for (const v of vs) {
                const extras = setDifference(closure.get(v) ?? new Set<V>(), closure.get(k) ?? new Set<V>())

                if (extras.size) {
                    updated = true

                    newActive.set(k, setAddAll(newActive.get(k) ?? new Set(), extras))
                    closure.set(k, setAddAll(closure.get(k) ?? new Set(), extras))
                }
            }
        }

        if (!updated) return closure

        active = newActive
    }
}