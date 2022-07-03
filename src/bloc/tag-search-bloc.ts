import {CombinedBlocExpensesOutputTagSummary} from "./combined-bloc";

export type TagSearchBlocSearchSummariesInput = {
    tagSummaries: Map<string, CombinedBlocExpensesOutputTagSummary>,
    tagSearch: TagSearchBlocSearchSummariesInputSearch,
}

export type TagSearchBlocSearchSummariesOutput = {
    tagSummaries: Map<string, CombinedBlocExpensesOutputTagSummary>,
}

export type TagSearchBlocSearchSummariesInputSearch = {
    name: string,
    isPartOf: string[],
}

export const TagSearchBloc = {
    searchSummaries: (input: TagSearchBlocSearchSummariesInput): TagSearchBlocSearchSummariesOutput => {
        const {name, isPartOf} = input.tagSearch

        return {
            tagSummaries: new Map(
                [...input.tagSummaries].filter(([tag, summary]) =>
                    tag.toLowerCase().includes(name.toLowerCase())
                    && isPartOf.every((parent) => summary.isPartOf.includes(parent))),
            ),
        }
    },
}