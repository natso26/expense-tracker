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
    expenses: Map<string, ExpenseBlocExpense>,
}

export type CombinedBlocGetExpensesInputFilter = {
    date?: Date,
    title: string,
    tags: string[],
}

export const CombinedBloc = {
    getExpenses: BlocHelper.wrapWithStateCallback(
        async (input: CombinedBlocGetExpensesInput): Promise<CombinedBlocGetExpensesOutput> => {
            const combined = await getCombined()

            const filter = input.filter

            return {
                expenses: new Map(
                    [...combined.expenses]
                        .filter(([id, expense]) =>
                            (!filter.date || onReferenceDate(expense.timestamp, filter.date))
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

const getCombined = async (): Promise<StoreValue> => {
    const storeState = Store.get()

    if (storeState.hasValue) return storeState.value

    const rawOutput = await CombinedApi.fetch()

    const output = processCombined(rawOutput)

    Store.set(output)

    return output
}