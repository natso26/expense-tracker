import {databaseDomain} from "./domain";
import {processExpense} from "./process-expense";

export type FetchExpensesOutput = {
    expenses: FetchExpensesOutputExpense[],
    tagRelations: FetchExpensesOutputTagRelation[],
}

export type FetchExpensesOutputExpense = {
    id: string,
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
    // computed properties
    expandedTags: string[],
}

export type FetchExpensesOutputTagRelation = {
    tag: string,
    isPartOf: string[],
    // computed properties
    contains: string[],
}

let cachedFetchExpenseOutput: FetchExpensesOutput | undefined = undefined

export const fetchExpenses = async (): Promise<FetchExpensesOutput> => {
    if (cachedFetchExpenseOutput) {
        return cachedFetchExpenseOutput
    }

    const response = await fetch(
        `${databaseDomain}.json`,
    )

    if (!response.ok) {
        const error = await response.text()

        throw Error(error)
    }

    const data = await response.json()

    const rawOutput = {
        expenses: Object.entries<{
            timestamp: string,
            title: string,
            amount: number,
            tags?: string[],
        }>(data?.expense ?? {}).map(([id, value]) => ({
            id,
            timestamp: new Date(value.timestamp),
            title: value.title,
            amount: value.amount,
            tags: value.tags ?? [],
        })).sort((a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime() || b.id.localeCompare(a.id),
        ),
        tagRelations: Object.entries<{
            isPartOf?: string[],
        }>(data?.tagRelation ?? {}).map(([tag, value]) => ({
            tag,
            isPartOf: value.isPartOf ?? [],
        })).sort((a, b) =>
            a.tag.localeCompare(b.tag)
        )
    }

    const output = processExpense(rawOutput)

    cachedFetchExpenseOutput = output

    return output
}

export const clearFetchExpensesCache = (): void => {
    cachedFetchExpenseOutput = undefined
}
