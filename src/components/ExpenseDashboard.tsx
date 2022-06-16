import React, {ChangeEvent} from "react";
import {State, StateConstructor} from "../common/state";
import {fetchExpenses, FetchExpensesOutput} from "../api/fetch-expenses";
import classes from './ExpenseDashboard.module.css'
import {ExpenseTable} from "./ExpenseTable";
import {parseTags, serializeTags} from "../common/tag";
import {addOneDay, parseDate, serializeDateForDateInput} from "../common/date";

export type ExpenseDashboardData = {
    defaultFilter: ExpenseDashboardDataFilter,
    filter: ExpenseDashboardDataFilter,
    setFilterCallback: (filter: ExpenseDashboardDataFilter) => void,
}

export type ExpenseDashboardDataFilter = {
    date?: Date,
    tags: string[],
}

export const ExpenseDashboard = (props: {
    data: ExpenseDashboardData,
}) => {
    type Filter = {
        date?: Date,
        tags: string[],
    }

    const [filter, setFilter] = React.useState<Filter>(props.data.filter)

    const [fetchExpensesOutput, setFetchExpensesOutput] = React.useState<State<FetchExpensesOutput>>(
        StateConstructor.IniState(),
    )

    const setFilterCallback = props.data.setFilterCallback

    React.useEffect(() => {
        setFilterCallback(filter)
    }, [setFilterCallback, filter])

    React.useEffect(() => {
        (async () => {
            setFetchExpensesOutput(StateConstructor.LoadingState())

            try {
                const data = await fetchExpenses()

                setFetchExpensesOutput(StateConstructor.DataState(data))

            } catch (e) {
                setFetchExpensesOutput(StateConstructor.ErrorState(e))
            }
        })()
    }, [])

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            date: parseDate(e.target.value),
        }))
    }

    const onTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            tags: parseTags(e.target.value),
        }))
    }

    const onClickClearFilter = () => {
        setFilter(() => {
            document.querySelector<HTMLInputElement>('#date')!.value = ''
            document.querySelector<HTMLInputElement>('#tags')!.value = ''

            return {
                date: undefined,
                tags: [],
            }
        })
    }

    const defaultFilter = props.data.defaultFilter

    const isFilterNonEmpty = Boolean(filter.date || filter.tags.length)

    const filteredExpenses = (fetchExpensesOutput.data?.expenses ?? []).filter((expense) => (
        (!filter.date || (expense.timestamp >= filter.date && expense.timestamp < addOneDay(filter.date)))
        && filter.tags.every((tag) => expense.tags.includes(tag))
    ))

    return <>
        <div className={classes['input-grid']}>
            <label htmlFor="date">Date</label>
            <input
                onChange={onDateChange}
                id="date"
                type="date"
                defaultValue={serializeDateForDateInput(defaultFilter.date)}
            />
            <label htmlFor="tags">Tags</label>
            <input
                onChange={onTagsChange}
                id="tags"
                type="search"
                placeholder="tag 1, tag 2"
                defaultValue={serializeTags(defaultFilter.tags)}
            />
        </div>
        {isFilterNonEmpty && (
            <div className={classes['vertical-space']}>
                <button onClick={onClickClearFilter}>Clear filter</button>
            </div>
        )}
        {(() => {
            switch (fetchExpensesOutput.state) {
                case "INIT":
                    return <></>

                case "LOADING":
                    return (
                        <div className={classes.loading}>
                            <p>Loading...</p>
                        </div>
                    )

                case "DATA":
                    return (
                        <ExpenseTable data={{
                            expenses: filteredExpenses,
                        }}/>
                    )

                case "ERROR":
                    return (
                        <div className={classes.error}>
                            <p>Error:</p>
                            <p>{fetchExpensesOutput.error.message ?? 'Unknown error'}</p>
                        </div>
                    )
            }
        })()}
    </>
}