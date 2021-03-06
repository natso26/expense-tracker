import {ExpenseBlocExpense} from "./expense-bloc";
import {CombinedApi} from "../api/combined-api";
import {processCombined} from "./process-combined";
import {onReferenceDate} from "../common/date";
import {BlocHelper} from "./bloc-helper";
import {State} from "../common/state";
import {cachedFunction, cachedFunctionSync} from "../common/cached-function";
import {PromiseOr, wrapFuncWithPromiseOr} from "../common/promise-or";

export type CombinedBlocTagSummary = {
    amount?: number,
    isPartOf: string[],
}

export const CombinedBloc = {
    getExpenses: BlocHelper.wrapWithStateCallback(
        (input: {
            filter: {
                date?: Date,
                title: string,
                tags: string[],
            },
        }): PromiseOr<{
            totalAmount: number,
            expenses: Map<string, ExpenseBlocExpense>,
            tagSummaries: (tagSearch: {
                name: string,
                isPartOf: string[],
            }) => Map<string, CombinedBlocTagSummary>,
        }> =>
            wrapFuncWithPromiseOr(getExpensesSync(input))(getCombined()),
    ),
}

const getExpensesSync = (
    {filter: {date, title, tags}}: Parameters<typeof CombinedBloc.getExpenses>[0],
): (combined: ReturnType<typeof getCombined> extends PromiseOr<infer T> ? T : never) =>
    Parameters<Parameters<typeof CombinedBloc.getExpenses>[1]>[0] extends State<infer T> ? T : never =>
    ({expenses, tagRules}) => {
        const expenseEntries = [...expenses]
            .filter(([, expense]) =>
                (!date || onReferenceDate(expense.timestamp, date))
                && expense.title.toLowerCase().includes(title.toLowerCase())
                && tags.every((tag) => expense.expandedTags.has(tag)))

        const [tagSummaryEntries] = cachedFunctionSync(() => {
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

            return [...tagSummaries]
                .sort(([tag1,], [tag2,]) =>
                    tag1.localeCompare(tag2))
        })

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
                tagSummaryEntries().filter(([tag,]) =>
                    tag.toLowerCase().includes(name.toLowerCase())
                    && isPartOf.every((ancestor) =>
                        tagRules.get(tag)?.expandedIsPartOf.has(ancestor) ?? ancestor === tag)
                ),
            ),
        }
    }

const [getCombined, combinedCache] = cachedFunction(async () =>
    processCombined(await CombinedApi.fetch()))

export const clearCombinedCache = combinedCache.clear