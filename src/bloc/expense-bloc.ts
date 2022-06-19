import {ExpenseApi} from "../api/expense-api";
import {Store} from "./store";
import {BlocHelper} from "./bloc-helper";

export type ExpenseBlocAddInput = {
    expense: ExpenseBlocExpense,
}

export type ExpenseBlocEditInput = {
    id: string,
    expense: ExpenseBlocExpense,
}

export type ExpenseBlocDeleteInput = {
    id: string,
}

export type ExpenseBlocExpense = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const ExpenseBloc = {
    add: BlocHelper.wrapWithStateCallback(
        async (input: ExpenseBlocAddInput) => {
            Store.clear()

            await ExpenseApi.add(input)
        },
    ),
    edit: BlocHelper.wrapWithStateCallback(
        async (input: ExpenseBlocEditInput): Promise<void> => {
            Store.clear()

            await ExpenseApi.edit(input)
        },
    ),
    delete: BlocHelper.wrapWithStateCallback(
        async (input: ExpenseBlocDeleteInput): Promise<void> => {
            Store.clear()

            await ExpenseApi.delete(input)
        },
    ),
}