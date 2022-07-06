import {ExpenseApi} from "../api/expense-api";
import {Store} from "./store";
import {BlocHelper} from "./bloc-helper";

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
            Store.clear()

            await ExpenseApi.add(input)
        },
    ),
    edit: BlocHelper.wrapWithStateCallback(
        async (input: {
            id: string,
            expense: ExpenseBlocExpense,
        }): Promise<void> => {
            Store.clear()

            await ExpenseApi.edit(input)
        },
    ),
    delete: BlocHelper.wrapWithStateCallback(
        async (input: {
            id: string,
        }): Promise<void> => {
            Store.clear()

            await ExpenseApi.delete(input)
        },
    ),
}