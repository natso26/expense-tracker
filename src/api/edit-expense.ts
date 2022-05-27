export type EditExpenseInput = {
    id: string,
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const editExpense = async (input: EditExpenseInput): Promise<void> => {
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

    console.log(response)

    if (!response.ok) {
        const error = await response.text()

        console.log(error)

        throw Error(error)
    }
}