import classes from './DashboardContents.module.css'
import React from "react";
import {serializeAmount} from "../../../common/expense";
import {ExpenseView, ExpenseViewDataExpense} from "./expense-view/ExpenseView";
import {TagSummaryView, TagSummaryViewDataSummary} from "./tag-summary-view/TagSummaryView";
import {useEffectSkipInitial} from "../../view-utils/hooks/helper";
import {GetSet} from "../../view-utils/type";

export type ExpenseDashboardContentsData = {
    data: ExpenseDashboardContentsDataData,
    query: ExpenseDashboardContentsDataQuery,
}

export type ExpenseDashboardContentsDataData = {
    totalAmount: number,
    expenses: Map<string, ExpenseViewDataExpense>,
    tagSummaries: (tagSearch: ExpenseDashboardContentsDataQueryTagSearch) => Map<string, TagSummaryViewDataSummary>,
}

export type ExpenseDashboardContentsDataQuery = {
    view: GetSet<ExpenseDashboardContentsDataQueryView>
    tagSearch: GetSet<ExpenseDashboardContentsDataQueryTagSearch>,
}

export type ExpenseDashboardContentsDataQueryView = 'expenses' | 'tags'

export type ExpenseDashboardContentsDataQueryTagSearch = {
    name: string,
    isPartOf: string[],
}

export const DashboardContents = (props: {
    data: ExpenseDashboardContentsData,
}) => {
    type View = 'expenses' | 'tags'

    const {
        data: {totalAmount, expenses, tagSummaries},
        query: {
            view: {get: getView, set: setViewCallback},
            tagSearch,
        },
    } = props.data

    const [view, setView] = React.useState<View>(getView())

    useEffectSkipInitial(() => {
        setViewCallback(view)
    }, [setViewCallback, view])

    const onClickChangeTabButton = () => {
        setView((view) => view === 'expenses' ? 'tags' : 'expenses')
    }

    return <>
        <div className={classes['vertical-space']}>
            <p>Total: <span className={classes.total}>{
                serializeAmount(totalAmount)
            }</span></p>
        </div>
        <div className={classes['vertical-space']}>
            <button onClick={onClickChangeTabButton}>{
                view === 'expenses' ? 'Tags view' : 'Expenses view'
            }</button>
        </div>
        {view === 'expenses'
            ? <ExpenseView data={{
                expenses,
            }}/>
            : <TagSummaryView data={{
                tagSummaries,
                tagSearch,
            }}/>
        }
    </>
}