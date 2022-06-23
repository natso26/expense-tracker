import {ExpenseBlocExpense} from "./expense-bloc";
import {Store, StoreValue} from "./store";
import {CombinedApi} from "../api/combined-api";
import {processCombined} from "./process-combined";
import {onReferenceDate} from "../common/date";
import {BlocHelper} from "./bloc-helper";

export type CombinedBlocGetExpensesInput = {
    filter: CombinedBlocGetExpensesInputFilter,
}

export type CombinedBlocGetExpensesOutput = {
    totalAmount: number,
    expenses: Map<string, ExpenseBlocExpense>,
    tagSummaries: Map<string, CombinedBlocExpensesOutputTagSummary>,
}

export type CombinedBlocGetExpensesInputFilter = {
    date?: Date,
    title: string,
    tags: string[],
}

export type CombinedBlocExpensesOutputTagSummary = {
    amount: number,
    isPartOf: string[],
}

export const CombinedBloc = {
    getExpenses: BlocHelper.wrapWithStateCallback(
        async (input: CombinedBlocGetExpensesInput): Promise<CombinedBlocGetExpensesOutput> => {
            const combined = await getCombined()

            const filter = input.filter

            const expenseEntries = [...combined.expenses]
                .filter(([, expense]) =>
                    (!filter.date || onReferenceDate(expense.timestamp, filter.date))
                    && expense.title.toLowerCase().includes(filter.title.toLowerCase())
                    && filter.tags.every((tag) => expense.expandedTags.has(tag)))

            const tagRules = combined.tagRules

            const tagSummaries = new Map<string, CombinedBlocExpensesOutputTagSummary>()

            for (const [, expense] of expenseEntries) {
                for (const tag of expense.expandedTags) {
                    const tagRule = tagRules.get(tag)

                    const tagSummary = tagSummaries.get(tag) || {
                        amount: 0,
                        isPartOf: tagRule?.isPartOf ?? [],
                    }

                    tagSummary.amount += expense.amount

                    tagSummaries.set(tag, tagSummary)
                }
            }

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
                tagSummaries: new Map(
                    [...tagSummaries].sort(([tag1, summary1], [tag2, summary2]) =>
                        summary2.amount - summary1.amount || tag1.localeCompare(tag2)),
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