import {makeCache} from "../common/cache";

export type StoreValue = {
    expenses: Map<string, {
        timestamp: Date,
        title: string,
        amount: number,
        tags: string[],
        expandedTags: Set<string>, // computed
    }>,
    tagRules: Map<string, {
        isPartOf: string[],
        expandedIsPartOf: Set<string>, // computed
    }>,
}

export const Store = makeCache<StoreValue>()