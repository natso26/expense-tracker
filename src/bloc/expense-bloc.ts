import {ExpenseApi} from "../api/expense-api";
import {CombinedCache} from "./combined-cache";
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
    add: BlocHelper.wrapWithSetState(
        async (input: ExpenseBlocAddInput) => {
            CombinedCache.clear()

            await ExpenseApi.add(input)
        },
    ),
    edit: BlocHelper.wrapWithSetState(
        async (input: ExpenseBlocEditInput): Promise<void> => {
            CombinedCache.clear()

            await ExpenseApi.edit(input)
        },
    ),
    delete: BlocHelper.wrapWithSetState(
        async (input: ExpenseBlocDeleteInput): Promise<void> => {
            CombinedCache.clear()

            await ExpenseApi.delete(input)
        },
    ),
}