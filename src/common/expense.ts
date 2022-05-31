import {compactSerializeTags, parseTags} from "./tag";

export type SerializeExpenseInput = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export type SerializeExpenseOutput = {
    timestamp: string,
    title: string,
    amount: string,
    tags: string,
}

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

export const serializeExpense = (input: SerializeExpenseInput): SerializeExpenseOutput => ({
    timestamp: input.timestamp.toISOString(),
    title: input.title,
    amount: input.amount.toFixed(2),
    tags: compactSerializeTags(input.tags),
})

export const parseExpense = (input: ParseExpenseInput): ParseExpenseOutput => ({
    timestamp: new Date(input.timestamp),
    title: input.title.trim(),
    amount: parseFloat(input.amount),
    tags: parseTags(input.tags),
})