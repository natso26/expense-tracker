import React from "react";
import {serializeAmount} from "../../../common/expense";
import {ExpenseView} from "./expense-view/ExpenseView";
import {TagSummaryView} from "./tag-summary-view/TagSummaryView";
import {useEffectSkipInitial} from "../../view-utils/hooks/helper";
import {GetSet} from "../../view-utils/type";
import {VerticalMargin} from "../../components/vertical-margin";
import {TextSpan} from '../../components/text-span';

export const DashboardContents = (props: {
    data: {
        query: {
            view: GetSet<View>
            tagSearch: Parameters<typeof TagSummaryView>[0]['data']['tagSearch'],
        },
        result: {
            totalAmount: number,
            expenses: Parameters<typeof ExpenseView>[0]['data']['expenses'],
            tagSummaries: Parameters<typeof TagSummaryView>[0]['data']['tagSummaries'],
        },
    },
}) => {
    const {
        query: {
            view: {get: getView, set: setViewCallback},
            tagSearch,
        },
        result: {totalAmount, expenses, tagSummaries},
    } = props.data

    const [view, setView] = React.useState<View>(getView())

    useEffectSkipInitial(() => {
        setViewCallback(view)
    }, [setViewCallback, view])

    const onClickChangeTabButton = () => {
        setView((view) => view === 'expenses' ? 'tags' : 'expenses')
    }

    return <>
        <VerticalMargin>
            <p>Total: <TextSpan.Bold>{
                serializeAmount(totalAmount)
            }</TextSpan.Bold></p>
        </VerticalMargin>
        <VerticalMargin>
            <button onClick={onClickChangeTabButton}>{
                view === 'expenses' ? 'Tags view' : 'Expenses view'
            }</button>
        </VerticalMargin>
        {view === 'expenses'
            ? <ExpenseView data={{
                expenses,
            }}/>
            : <TagSummaryView data={{
                tagSearch,
                tagSummaries,
            }}/>
        }
    </>
}

type View = 'expenses' | 'tags'