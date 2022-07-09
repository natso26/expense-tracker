import {ExpenseApi} from "../api/expense-api";
import {BlocHelper} from "./bloc-helper";
import {clearCombinedCache} from "./combined-bloc";

export type ExpenseBlocExpense = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const ExpenseBloc = {
    add: BlocHelper.wrapWithStateCallback(
        async (input: {
            expense: ExpenseBlocExpense,
        }): Promise<void> => {
            clearCombinedCache()

            await ExpenseApi.add(input)
        },
    ),
    edit: BlocHelper.wrapWithStateCallback(
        async (input: {
            id: string,
            expense: ExpenseBlocExpense,
        }): Promise<void> => {
            clearCombinedCache()

            await ExpenseApi.edit(input)
        },
    ),
    delete: BlocHelper.wrapWithStateCallback(
        async (input: {
            id: string,
        }): Promise<void> => {
            clearCombinedCache()

            await ExpenseApi.delete(input)
        },
    ),
}