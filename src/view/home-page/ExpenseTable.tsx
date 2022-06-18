import {serializeTags} from "../../common/tag";
import classes from './ExpenseTable.module.css'
import React, {MouseEvent} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import {serializeExpense} from "../../common/expense";

export type ExpenseTableData = {
    expenses: Map<string, ExpenseTableDataExpense>,
}

export type ExpenseTableDataExpense = {
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
        const id = e.currentTarget.id
        const expense = props.data.expenses.get(id)!

        navigate({
            pathname: `/edit-expense/${id}`,
            search: createSearchParams(
                serializeExpense(expense)
            ).toString(),
        })
    }

    const expenseEntries = [...props.data.expenses.entries()]

    const totalAmount = expenseEntries
        .map(([id, expense]) => expense.amount)
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
            {expenseEntries.map(([id, expense], index, array) => <>
                {(!index || expense.timestamp.toDateString() !== array[index - 1][1].timestamp.toDateString()) && (
                    <tr>
                        <td className={classes.date} colSpan={4}>{expense.timestamp.toDateString()}</td>
                    </tr>
                )}
                <tr id={id} onClick={onClickExpense}>
                    <td>{expense.timestamp.toLocaleTimeString('en-GB', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</td>
                    <td>{expense.title}</td>
                    <td className={classes.amount}>{(expense.amount || null)?.toFixed(2) ?? '\u2013'}</td>
                    <td>{serializeTags(expense.tags)}</td>
                </tr>
            </>)}
            </tbody>
        </table>
    </>
}