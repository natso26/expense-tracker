import {ExpenseBlocExpense} from "./expense-bloc";
import {Store, StoreValue} from "./store";
import {CombinedApi} from "../api/combined-api";
import {processCombined} from "./process-combined";
import {onReferenceDate} from "../common/date";
import {BlocHelper} from "./bloc-helper";

export type CombinedBlocTagSummary = {
    amount?: number,
    isPartOf: string[],
}

export const CombinedBloc = {
    getExpenses: BlocHelper.wrapWithStateCallback(
        async (input: {
            filter: {
                date?: Date,
                title: string,
                tags: string[],
            },
        }): Promise<{
            totalAmount: number,
            expenses: Map<string, ExpenseBlocExpense>,
            tagSummaries: (tagSearch: {
                name: string,
                isPartOf: string[],
            }) => Map<string, CombinedBlocTagSummary>,
        }> => {
            const {filter: {date, title, tags}} = input

            const {expenses, tagRules} = await getCombined()

            const expenseEntries = [...expenses]
                .filter(([, expense]) =>
                    (!date || onReferenceDate(expense.timestamp, date))
                    && expense.title.toLowerCase().includes(title.toLowerCase())
                    && tags.every((tag) => expense.expandedTags.has(tag)))

            const tagSummaries = new Map<string, CombinedBlocTagSummary>(
                [...tagRules].map(([tag, rule]) => [tag, {
                    isPartOf: rule.isPartOf,
                }]),
            )

            for (const [, expense] of expenseEntries) {
                for (const tag of expense.expandedTags) {
                    const tagSummary = tagSummaries.get(tag)

                    tagSummaries.set(tag, {
                        amount: (tagSummary?.amount || 0) + expense.amount,
                        isPartOf: tagSummary?.isPartOf || [],
                    })
                }
            }

            const tagSummaryEntries = [...tagSummaries]
                .sort(([tag1,], [tag2,]) =>
                    tag1.localeCompare(tag2))

            return {
                totalAmount: expenseEntries.reduce((sum, [, expense]) =>
                    sum + expense.amount, 0),
                expenses: new Map(
                    expenseEntries.map(([id, expense]) => [id, {
                        timestamp: expense.timestamp,
                        title: expense.title,
                        amount: expense.amount,
                        tags: expense.tags,
                    }]),
                ),
                tagSummaries: ({name, isPartOf}) => new Map(
                    tagSummaryEntries.filter(([tag,]) =>
                        tag.toLowerCase().includes(name.toLowerCase())
                        && isPartOf.every((ancestor) =>
                            tagRules.get(tag)?.expandedIsPartOf.has(ancestor))
                    ),
                ),
            }
        },
    ),
}

const getCombined = async (): Promise<StoreValue> => {
    const storeState = Store.get()

    if (storeState.hasValue) return storeState.value

    const rawOutput = await CombinedApi.fetch()

    const output = processCombined(rawOutput)

    Store.set(output)

    return output
}