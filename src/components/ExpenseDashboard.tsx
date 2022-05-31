import React, {ChangeEvent} from "react";
import {State, StateConstructor} from "../common/state";
import {fetchExpenses, FetchExpensesOutput} from "../api/fetch-expenses";
import classes from './ExpenseDashboard.module.css'
import {ExpenseTable} from "./ExpenseTable";
import {parseTags, serializeTags} from "../common/tag";
import {parseDate, serializeDateForInput} from "../common/date";

export type ExpenseDashboardData = {
    defaultFilter: ExpenseDashboardDataFilter,
    filter: ExpenseDashboardDataFilter,
    setFilterCallback: (filter: ExpenseDashboardDataFilter) => void,
}

export type ExpenseDashboardDataFilter = {
    startTime?: Date,
    endTime?: Date,
    tags: string[],
}

export const ExpenseDashboard = (props: {
    data: ExpenseDashboardData,
}) => {
    type Filter = {
        startTime?: Date,
        endTime?: Date,
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

    const onStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            startTime: parseDate(e.target.value),
        }))
    }

    const onEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            endTime: parseDate(e.target.value),
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
            document.querySelector<HTMLInputElement>('#start-time')!.value = ''
            document.querySelector<HTMLInputElement>('#end-time')!.value = ''
            document.querySelector<HTMLInputElement>('#tags')!.value = ''

            return {
                startTime: undefined,
                endTime: undefined,
                tags: [],
            }
        })
    }

    const defaultFilter = props.data.defaultFilter

    const isFilterNonEmpty = Boolean(filter.startTime || filter.endTime || filter.tags.length)

    const filteredExpenses = (fetchExpensesOutput.data?.expenses ?? []).filter((expense) => (
        (!filter.startTime || expense.timestamp >= filter.startTime)
        && (!filter.endTime || expense.timestamp < filter.endTime)
        && filter.tags.every((tag) => expense.tags.includes(tag))
    ))

    return <>
        <div className={classes['input-grid']}>
            <label htmlFor="start-time">Start time</label>
            <input
                onChange={onStartTimeChange}
                id="start-time"
                type="datetime-local"
                defaultValue={serializeDateForInput(defaultFilter.startTime)}
            />
            <label htmlFor="end-time">End time</label>
            <input
                onChange={onEndTimeChange}
                id="end-time"
                type="datetime-local"
                defaultValue={serializeDateForInput(defaultFilter.endTime)}
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