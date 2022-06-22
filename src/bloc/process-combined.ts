import {CombinedApiFetchOutput} from "../api/combined-api";
import {StoreValue} from "./store";
import {reverseGraph, transitiveClosure} from "../common/graph";

export const processCombined = (input: CombinedApiFetchOutput): StoreValue => {
    const inclusions = new Map(
        [...input.tagRelations].map(([tag, relation]) =>
            [tag, new Set(relation.isPartOf)]),
    )

    const containments = reverseGraph(inclusions)

    const expandedInclusions = transitiveClosure(inclusions)

    const expenseEntries = [...input.expenses]

    return {
        expenses: new Map(
            expenseEntries
                .sort(([id1, expense1], [id2, expense2]) =>
                    expense2.timestamp.getTime() - expense1.timestamp.getTime() || id2.localeCompare(id1))
                .map(([id, expense]) => [id, {
                    ...expense,
                    expandedTags: new Set(
                        [...expense.tags]
                            .flatMap((tag) => [tag, ...expandedInclusions.get(tag) ?? []])
                            .sort(),
                    ),
                }]),
        ),
        tagRelations: new Map(
            [...new Set([
                ...inclusions.keys(), ...containments.keys(),
            ])].sort()
                .map((tag) => [
                    tag,
                    {
                        isPartOf: [...inclusions.get(tag) ?? []].sort(),
                        contains: [...containments.get(tag) ?? []].sort(),
                    },
                ]),
        ),
    }
}