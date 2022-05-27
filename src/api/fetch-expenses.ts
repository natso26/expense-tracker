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

export const fetchExpenses = async (): Promise<FetchExpensesOutput> => {
    const response = await fetch(
        'https://natso-test-default-rtdb.asia-southeast1.firebasedatabase.app/expense.json',
    )

    console.log(response)

    if (!response.ok) {
        const error = await response.text()

        console.log(error)

        throw Error(error)
    }

    const data = await response.json()

    console.log(data)

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

    console.log(output)

    return output
}
