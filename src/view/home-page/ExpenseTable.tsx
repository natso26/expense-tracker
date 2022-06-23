import {createSearchParams, useNavigate} from "react-router-dom";
import React, {MouseEvent} from "react";
import {serializeAmount} from "../../common/expense";
import {compactSerializeTags, serializeTags} from "../../common/tag";
import classes from "./ExpenseTable.module.css";
import {onSameDate} from "../../common/date";

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
            search: createSearchParams({
                timestamp: expense.timestamp.toISOString(),
                title: expense.title,
                amount: serializeAmount(expense.amount),
                tags: compactSerializeTags(expense.tags),
            }).toString(),
        })
    }

    const expenseEntries = [...props.data.expenses]

    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <table className={classes['styled-table']}>
            <thead>
            <tr>
                <th>Time</th>
                <th>Title</th>
                <th className={classes.number}>Amount</th>
                <th>Tags</th>
            </tr>
            </thead>
            <tbody>
            {expenseEntries.flatMap(([id, expense], index, array) => [
                (!index || !onSameDate(expense.timestamp, array[index - 1][1].timestamp)) && (
                    <tr key={`${id}_date_header`} id={`${id}_date_header`}>
                        <td className={classes.date} colSpan={4}>{expense.timestamp.toDateString()}</td>
                    </tr>
                ),
                <tr key={id} id={id} onClick={onClickExpense}>
                    <td>{dateTimeFormat.format(expense.timestamp)}</td>
                    <td>{expense.title}</td>
                    <td className={classes.number}>{serializeAmount(expense.amount || null) || '\u2013'}</td>
                    <td>{serializeTags(expense.tags)}</td>
                </tr>
            ])}
            </tbody>
        </table>
    )
}