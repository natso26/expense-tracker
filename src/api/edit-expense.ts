import {clearFetchExpensesCache} from "./fetch-expenses";

export type EditExpenseInput = {
    id: string,
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const editExpense = async (input: EditExpenseInput): Promise<void> => {
    clearFetchExpensesCache()

    const response = await fetch(
        `https://natso-test-default-rtdb.asia-southeast1.firebasedatabase.app/expense/${input.id}.json`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timestamp: input.timestamp,
                title: input.title,
                amount: input.amount,
                tags: input.tags,
            }),
        }
    )

    if (!response.ok) {
        const error = await response.text()

        throw Error(error)
    }
}