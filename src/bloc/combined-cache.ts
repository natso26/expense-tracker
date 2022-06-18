import {makeCache} from "../common/cache";

export type CombinedCacheValue = {
    expenses: Map<string, CombinedCacheValueExpense>,
    tagRelations: Map<string, CombinedCacheValueTagRelation>,
}

export type CombinedCacheValueExpense = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
    expandedTags: Set<string>, // computed
}

export type CombinedCacheValueTagRelation = {
    isPartOf: string[]
    contains: string[], // computed
}

export const CombinedCache = makeCache<CombinedCacheValue>()