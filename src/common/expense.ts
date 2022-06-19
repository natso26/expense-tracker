import {parseTags} from "./tag";

export type ParseExpenseInput = {
    timestamp: string,
    title: string,
    amount: string,
    tags: string,
}

export type ParseExpenseOutput = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const parseExpense = (input: ParseExpenseInput): ParseExpenseOutput => ({
    timestamp: new Date(input.timestamp),
    title: input.title.trim(),
    amount: parseFloat(input.amount || '0'),
    tags: parseTags(input.tags),
})

export const serializeAmount = (amount: number | undefined): string => (
    amount === undefined ? '' : amount.toFixed(2)
)