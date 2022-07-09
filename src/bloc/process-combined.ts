import {CombinedApi} from "../api/combined-api";
import {transitiveClosure} from "../common/graph";

export const processCombined = (input: Awaited<ReturnType<typeof CombinedApi.fetch>>): {
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
} => {
    const isPartOfs = new Map(
        [...input.tagRules].map(([tag, rule]) =>
            [tag, new Set(rule.isPartOf)]),
    )

    const expandedIsPartOfs = transitiveClosure(isPartOfs)

    return {
        expenses: new Map(
            [...input.expenses]
                .sort(([id1, expense1], [id2, expense2]) =>
                    expense2.timestamp.getTime() - expense1.timestamp.getTime() || id2.localeCompare(id1))
                .map(([id, expense]) => [id, {
                    ...expense,
                    expandedTags: new Set(
                        [...expense.tags]
                            .flatMap((tag) => [tag, ...expandedIsPartOfs.get(tag) ?? []])
                            .sort(),
                    ),
                }]),
        ),
        tagRules: new Map(
            [...input.tagRules]
                .sort(([tag1,], [tag2,]) =>
                    tag1.localeCompare(tag2))
                .map(([tag, rule]) => [tag, {
                    ...rule,
                    expandedIsPartOf: new Set([tag, ...expandedIsPartOfs.get(tag) ?? []]),
                }]),
        ),
    }
}