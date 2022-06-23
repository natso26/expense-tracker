import {CombinedApiFetchOutput} from "../api/combined-api";
import {StoreValue} from "./store";
import {transitiveClosure} from "../common/graph";

export const processCombined = (input: CombinedApiFetchOutput): StoreValue => {
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
        tagRules: input.tagRules,
    }
}