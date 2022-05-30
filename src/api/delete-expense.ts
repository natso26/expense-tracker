import {clearFetchExpensesCache} from "./fetch-expenses";

export type DeleteExpenseInput = {
    id: string,
}


export const deleteExpense = async (input: DeleteExpenseInput): Promise<void> => {
    clearFetchExpensesCache()

    const response = await fetch(
        `https://natso-test-default-rtdb.asia-southeast1.firebasedatabase.app/expense/${input.id}.json`,
        {
            method: 'DELETE',
        },
    )

    if (!response.ok) {
        const error = await response.text()

        throw Error(error)
    }
}