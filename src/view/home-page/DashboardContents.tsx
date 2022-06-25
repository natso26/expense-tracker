import classes from './DashboardContents.module.css'
import React from "react";
import {serializeAmount} from "../../common/expense";
import {ExpenseTable, ExpenseTableDataExpense} from "./ExpenseTable";
import {TagSummaryTable, TagSummaryTableDataSummary} from "./TagSummaryTable";
import {useEffectIfNotInitial} from "../view-utils/hooks";

export type ExpenseDashboardContentsData = {
    data: ExpenseDashboardContentsDataData,
    view: ExpenseDashboardContentsView,
    setViewCallback: (view: ExpenseDashboardContentsView) => void,
}

export type ExpenseDashboardContentsDataData = {
    totalAmount: number,
    expenses: Map<string, ExpenseTableDataExpense>,
    tagSummaries: Map<string, TagSummaryTableDataSummary>,
}

export type ExpenseDashboardContentsView = 'expenses' | 'tags'

export const DashboardContents = (props: {
    data: ExpenseDashboardContentsData,
}) => {
    type View = 'expenses' | 'tags'

    const {setViewCallback} = props.data

    const [view, setView] = React.useState<View>(props.data.view)

    useEffectIfNotInitial(() => {
        setViewCallback(view)
    }, [setViewCallback, view])

    const onClickChangeTabButton = () => {
        setView((view) => view === 'expenses' ? 'tags' : 'expenses')
    }

    return <>
        <div className={classes['vertical-space']}>
            <p>Total: <span className={classes.total}>{serializeAmount(props.data.data.totalAmount)}</span></p>
        </div>
        <div className={classes['vertical-space']}>
            <button onClick={onClickChangeTabButton}>{
                view === 'expenses' ? 'Tags view' : 'Expenses view'
            }</button>
        </div>
        {view === 'expenses'
            ? <ExpenseTable data={{
                expenses: props.data.data.expenses,
            }}/>
            : <TagSummaryTable data={{
                tagSummaries: props.data.data.tagSummaries,
            }}/>
        }
    </>
}