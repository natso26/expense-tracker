export type FetchExpensesOutput = {
    expenses: FetchExpensesOutputExpense[],
}

export type FetchExpensesOutputExpense = {
    id: string,
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

let cachedFetchExpenseOutput: FetchExpensesOutput | undefined = undefined

export const fetchExpenses = async (): Promise<FetchExpensesOutput> => {
    if (cachedFetchExpenseOutput) {
        return cachedFetchExpenseOutput
    }

    const response = await fetch(
        'https://natso-test-default-rtdb.asia-southeast1.firebasedatabase.app/expense.json',
    )

    if (!response.ok) {
        const error = await response.text()

        throw Error(error)
    }

    const data = await response.json()

    const output = {
        expenses: Object.entries<{
            timestamp: string,
            title: string,
            amount: number,
            tags?: string[],
        }>(data ?? {}).map(([id, value]) => ({
            id,
            timestamp: new Date(value.timestamp),
            title: value.title,
            amount: value.amount,
            tags: value.tags ?? [],
        })).sort((a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime(),
        )
    }

    cachedFetchExpenseOutput = output

    return output
}

export const clearFetchExpensesCache = (): void => {
    cachedFetchExpenseOutput = undefined
}