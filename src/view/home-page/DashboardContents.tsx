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
    type View = 'expenses' | 'tags'

    const [view, setView] = React.useState<View>('expenses')

    const onClickChangeTabButton = () => {
        setView(view === 'expenses' ? 'tags' : 'expenses')
    }

    return <>
        <div className={classes['vertical-space']}>
            <p>Total: <span className={classes.total}>{serializeAmount(props.data.totalAmount)}</span></p>
        </div>
        <div className={classes['vertical-space']}>
            <button onClick={onClickChangeTabButton}>{
                view === 'expenses' ? 'Tags view' : 'Expenses view'
            }</button>
        </div>
        {view === 'expenses'
            ? <ExpenseTable data={{
                expenses: props.data.expenses,
            }}/>
            : <TagSummaryTable data={{
                tagSummaries: props.data.tagSummaries,
            }}/>
        }
    </>
}