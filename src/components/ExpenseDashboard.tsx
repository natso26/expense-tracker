import React, {ChangeEvent} from "react";
import {State, StateConstructor} from "../common/state";
import {fetchExpenses, FetchExpensesOutput} from "../api/fetch-expenses";
import classes from './ExpenseDashboard.module.css'
import {ExpenseTable} from "./ExpenseTable";
import {parseTags} from "../common/tag";
import {serializeDateForInput} from "../common/date";


export type ExpenseDashboardData = {
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

    const onStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            startTime: e.target.value ? new Date(e.target.value) : undefined,
        }))
    }

    const onEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            endTime: e.target.value ? new Date(e.target.value) : undefined,
        }))
    }

    const onTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            tags: parseTags(e.target.value),
        }))
    }

    const setFilterCallback = props.data.setFilterCallback

    React.useEffect(() => {
        setFilterCallback(filter)
    }, [setFilterCallback, filter])

    const filteredExpenses = (fetchExpensesOutput.data?.expenses ?? []).filter((expense) => (
        (!filter.startTime || expense.timestamp >= filter.startTime)
        && (!filter.endTime || expense.timestamp < filter.endTime)
        && filter.tags.every((tag) => expense.tags.includes(tag))
    ))

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
    }, [setFetchExpensesOutput])

    return <>
        <div className={classes['input-grid']}>
            <label htmlFor="start-time">Start time</label>
            <input
                onChange={onStartTimeChange}
                id="start-time"
                type="datetime-local"
                defaultValue={filter.startTime ? serializeDateForInput(filter.startTime) : ''}
            />
            <label htmlFor="end-time">End time</label>
            <input
                onChange={onEndTimeChange}
                id="end-time"
                type="datetime-local"
                defaultValue={filter.endTime ? serializeDateForInput(filter.endTime) : ''}
            />
            <label htmlFor="tags">Tags</label>
            <input
                onChange={onTagsChange}
                id="tags"
                type="search"
                defaultValue={filter.tags.join(', ')}
            />
        </div>
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