import {parseTags} from "./tag";
import {parseDateTime} from "./date";

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
    timestamp: parseDateTime(input.timestamp) || new Date(),
    title: input.title.trim(),
    amount: parseFloat(input.amount || '0'),
    tags: parseTags(input.tags),
})

export const serializeAmount = (amount: number | null): string => (
    amount === null ? '' : amount.toFixed(2)
)