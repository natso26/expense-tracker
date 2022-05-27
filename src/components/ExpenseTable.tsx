import {serializeTags} from "../common/tag";
import classes from './ExpenseTable.module.css'
import React, {MouseEvent} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import {serializeExpense} from "../common/expense";

export type ExpenseTableData = {
    expenses: ExpenseTableDataExpense[],
}

export type ExpenseTableDataExpense = {
    id: string,
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const ExpenseTable = (props: {
    data: ExpenseTableData,
}) => {
    const navigate = useNavigate()

    const onClickExpense = (e: MouseEvent<HTMLTableRowElement>) => {
        const expense = props.data.expenses.find((expense) => (
            expense.id === e.currentTarget.id
        ))!

        navigate({
            pathname: `/edit-expense/${expense.id}`,
            search: createSearchParams(
                serializeExpense(expense)
            ).toString(),
        })
    }

    const totalAmount = props.data.expenses
        .map((expense) => expense.amount)
        .reduce((a, b) => a + b, 0)

    return <>
        <div className={classes['vertical-space']}>
            <p>Total: <span className={classes.total}>{totalAmount.toFixed(2)}</span></p>
        </div>
        <table className={classes['styled-table']}>
            <thead>
            <tr>
                <th>Time</th>
                <th>Title</th>
                <th className={classes.amount}>Amount</th>
                <th>Tags</th>
            </tr>
            </thead>
            <tbody>
            {props.data.expenses.map((expense, index, array) => <>
                {(!index || expense.timestamp.getDate() !== array[index - 1].timestamp.getDate()) && (
                    <tr>
                        <td className={classes.date} colSpan={4}>{expense.timestamp.toDateString()}</td>
                    </tr>
                )}
                <tr id={expense.id} onClick={onClickExpense}>
                    <td>{expense.timestamp.toLocaleTimeString(undefined, {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</td>
                    <td>{expense.title}</td>
                    <td className={classes.amount}>{expense.amount.toFixed(2)}</td>
                    <td>{serializeTags(expense.tags)}</td>
                </tr>
            </>)}
            </tbody>
        </table>
    </>
}