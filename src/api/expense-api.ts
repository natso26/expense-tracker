import {databaseDomain} from "./const";

export type ExpenseApiExpense = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const ExpenseApi = {
    add: async (input: {
        expense: ExpenseApiExpense,
    }): Promise<void> => {
        const response = await fetch(
            `${databaseDomain}/expense.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input.expense),
            },
        )

        if (!response.ok) {
            const error = await response.text()

            throw Error(error)
        }
    },
    edit: async (input: {
        id: string,
        expense: ExpenseApiExpense,
    }): Promise<void> => {
        const response = await fetch(
            `${databaseDomain}/expense/${input.id}.json`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input.expense),
            },
        )

        if (!response.ok) {
            const error = await response.text()

            throw Error(error)
        }
    },
    delete: async (input: {
        id: string,
    }): Promise<void> => {
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
    },
}