import classes from './DashboardContents.module.css'
import React from "react";
import {serializeAmount} from "../../common/expense";
import {ExpenseTable, ExpenseTableDataExpense} from "./ExpenseTable";
import {TagSummaryTable, TagSummaryTableDataSummary} from "./TagSummaryTable";

export type ExpenseDashboardContentsData = {
    totalAmount: number,
    expenses: Map<string, ExpenseTableDataExpense>,
    tagSummaries: Map<string, TagSummaryTableDataSummary>,
}

export const DashboardContents = (props: {
    data: ExpenseDashboardContentsData,
}) => {
    type Tab = 'expenses' | 'tags'

    const [tab, setTab] = React.useState<Tab>('expenses')

    const onClickChangeTabButton = () => {
        setTab(tab === 'expenses' ? 'tags' : 'expenses')
    }

    return <>
        <div className={classes['vertical-space']}>
            <p>Total: <span className={classes.total}>{serializeAmount(props.data.totalAmount)}</span></p>
            <p>
                <button onClick={onClickChangeTabButton}>{
                    tab === 'expenses' ? 'Tags view' : 'Expenses view'
                }</button>
            </p>
        </div>
        {tab === 'expenses'
            ? <ExpenseTable data={{
                expenses: props.data.expenses,
            }}/>
            : <TagSummaryTable data={{
                tagSummaries: props.data.tagSummaries,
            }}/>
        }
    </>
}