import {clearFetchExpensesCache} from "./fetch-expenses";
import {databaseDomain} from "./domain";

export type DeleteExpenseInput = {
    id: string,
}

export const deleteExpense = async (input: DeleteExpenseInput): Promise<void> => {
    clearFetchExpensesCache()

    const response = await fetch(
        `${databaseDomain}/expense/${input.id}.json`,
        {
            method: 'DELETE',
        },
    )

    if (!response.ok) {
        const error = await response.text()

        throw Error(error)
    }
}