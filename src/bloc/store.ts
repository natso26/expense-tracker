import {makeCache} from "../common/cache";

export type StoreValue = {
    expenses: Map<string, StoreValueExpense>,
    tagRelations: Map<string, StoreValueTagRelation>,
}

export type StoreValueExpense = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
    expandedTags: Set<string>, // computed
}

export type StoreValueTagRelation = {
    isPartOf: string[]
    contains: string[], // computed
}

export const Store = makeCache<StoreValue>()