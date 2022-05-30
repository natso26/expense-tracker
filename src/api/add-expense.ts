import {clearFetchExpensesCache} from "./fetch-expenses";

export type AddExpenseInput = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const addExpense = async (input: AddExpenseInput): Promise<void> => {
    clearFetchExpensesCache()

    const response = await fetch(
        'https://natso-test-default-rtdb.asia-southeast1.firebasedatabase.app/expense.json',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    )

    if (!response.ok) {
        const error = await response.text()

        throw Error(error)
    }
}