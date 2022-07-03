import {createSearchParams, useNavigate} from "react-router-dom";
import React, {MouseEvent} from "react";
import {serializeAmount} from "../../../../common/expense";
import {compactSerializeTags, serializeTags} from "../../../../common/tag";
import {onSameDate} from "../../../../common/date";
import {Table} from "../../../components/table";

export const ExpenseView = (props: {
    data: {
        expenses: Map<string, {
            timestamp: Date,
            title: string,
            amount: number,
            tags: string[],
        }>,
    },
}) => {
    const {expenses} = props.data

    const navigate = useNavigate()

    const onClickExpense = (e: MouseEvent<HTMLTableRowElement>) => {
        const id = e.currentTarget.id
        const expense = expenses.get(id)!

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

    const expenseEntries = [...expenses]

    return (
        <Table.Table>
            <thead>
            <tr>
                <th>Time</th>
                <th>Title</th>
                <Table.Header.Number>Amount</Table.Header.Number>
                <th>Tags</th>
            </tr>
            </thead>
            <tbody>
            {expenseEntries.flatMap(([id, expense], index, array) => [
                (!index || !onSameDate(expense.timestamp, array[index - 1][1].timestamp)) && (
                    <Table.Row.Date key={`${id}_date_row`} id={`${id}_date_row`}>
                        <td colSpan={4}>{
                            expense.timestamp.toDateString()
                        }</td>
                    </Table.Row.Date>
                ),
                <tr key={id} id={id} onClick={onClickExpense}>
                    <td>{dateTimeFormat.format(expense.timestamp)}</td>
                    <td>{expense.title}</td>
                    <Table.Data.Number>{
                        serializeAmount(expense.amount || null) || '\u2013'
                    }</Table.Data.Number>
                    <td>{serializeTags(expense.tags)}</td>
                </tr>
            ])}
            </tbody>
        </Table.Table>
    )
}

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
})