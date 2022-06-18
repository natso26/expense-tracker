import {ExpenseBlocExpense} from "./expense-bloc";
import {CombinedCache, CombinedCacheValue} from "./combined-cache";
import {CombinedApi} from "../api/combined-api";
import {processCombined} from "./process-combined";
import {addOneDay} from "../common/date";
import {BlocHelper} from "./bloc-helper";

export type CombinedBlocGetExpensesInput = {
    filter: CombinedBlocGetExpensesInputFilter,
}

export type CombinedBlocGetExpensesOutput = {
    expenses: Map<string, ExpenseBlocExpense>,
}

export type CombinedBlocGetExpensesInputFilter = {
    date?: Date,
    title: string,
    tags: string[],
}

export const CombinedBloc = {
    getExpenses: BlocHelper.wrapWithSetState(
        async (input: CombinedBlocGetExpensesInput): Promise<CombinedBlocGetExpensesOutput> => {
            const combined = await getCombined()

            const filter = input.filter

            return {
                expenses: new Map(
                    [...combined.expenses]
                        .filter(([id, expense]) =>
                            (!filter.date || (expense.timestamp >= filter.date && expense.timestamp < addOneDay(filter.date)))
                            && expense.title.toLowerCase().includes(filter.title.toLowerCase())
                            && filter.tags.every((tag) => expense.expandedTags.has(tag)))
                        .map(([id, expense]) => [id, {
                            timestamp: expense.timestamp,
                            title: expense.title,
                            amount: expense.amount,
                            tags: expense.tags,
                        }]),
                ),
            }
        },
    ),
}

const getCombined = async (): Promise<CombinedCacheValue> => {
    const cacheState = CombinedCache.get()

    if (cacheState.hasValue) return cacheState.value

    const rawOutput = await CombinedApi.fetch()

    const output = processCombined(rawOutput)

    CombinedCache.set(output)

    return output
}