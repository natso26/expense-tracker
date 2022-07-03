import {makeCache} from "../common/cache";

export type StoreValue = {
    expenses: Map<string, StoreValueExpense>,
    tagRules: Map<string, StoreValueTagRule>,
}

export type StoreValueExpense = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
    expandedTags: Set<string>, // computed
}

export type StoreValueTagRule = {
    isPartOf: string[],
    expandedIsPartOf: Set<string>, // computed
}

export const Store = makeCache<StoreValue>()