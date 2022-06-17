import {FetchExpensesOutput} from "./fetch-expenses";

export type ProcessExpenseInput = {
    expenses: ProcessExpenseInputExpense[],
    tagRelations: ProcessExpenseInputTagRelation[],
}

export type  ProcessExpenseInputExpense = {
    id: string,
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export type ProcessExpenseInputTagRelation = {
    tag: string,
    isPartOf: string[],
}

export const processExpense = (input: ProcessExpenseInput): FetchExpensesOutput => {
    const inclusions = new Map<string, Set<string>>()
    const containments = new Map<string, Set<string>>()

    input.tagRelations.forEach((tagRelation) => {
        const tag = tagRelation.tag

        tagRelation.isPartOf.forEach((parent) => {
            inclusions.set(tag, (inclusions.get(tag) ?? new Set()).add(parent))
            containments.set(parent, (containments.get(parent) ?? new Set()).add(tag))
        })
    })

    const expandedInclusions = transitiveClosure(inclusions)

    return {
        expenses: input.expenses.map((expense) => ({
            ...expense,
            expandedTags: Array.from(new Set<string>(
                expense.tags.flatMap((tag) => [
                    tag, ...Array.from(
                        expandedInclusions.get(tag) ?? new Set<string>(),
                    ),
                ]),
            )).sort(),
        })),
        tagRelations: Array.from(new Set([
            ...Array.from(inclusions.keys()), ...Array.from(containments.keys()),
        ])).sort()
            .map((tag) => ({
                tag,
                isPartOf: Array.from(
                    inclusions.get(tag) ?? new Set<string>(),
                ),
                contains: Array.from(
                    containments.get(tag) ?? new Set<string>(),
                ).sort(),
            })),
    }
}

const transitiveClosure = <V>(graph: Map<V, Set<V>>): Map<V, Set<V>> => {
    const closure = new Map<V, Set<V>>()

    graph.forEach((neighbors, vertex) => {
        closure.set(vertex, new Set(neighbors))
    })

    while (true) {
        let updated = false

        closure.forEach((neighbors, vertex) => {
            const newNeighbors = new Set(neighbors)

            neighbors.forEach((neighbor) => {
                (graph.get(neighbor) ?? new Set()).forEach((nextNeighbor) => {
                    if (!newNeighbors.has(nextNeighbor)) {
                        updated = true

                        newNeighbors.add(nextNeighbor)
                    }
                })
            })

            closure.set(vertex, newNeighbors)
        })

        if (!updated) return closure
    }
}