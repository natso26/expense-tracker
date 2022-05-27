export type DeleteExpenseInput = {
    id: string,
}


export const deleteExpense = async (input: DeleteExpenseInput): Promise<void> => {
    const response = await fetch(
        `https://natso-test-default-rtdb.asia-southeast1.firebasedatabase.app/expense/${input.id}.json`,
        {
            method: 'DELETE',
        },
    )

    console.log(response)

    if (!response.ok) {
        const error = await response.text()

        console.log(error)

        throw Error(error)
    }
}