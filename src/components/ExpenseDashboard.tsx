import React, {ChangeEvent} from "react";
import {State, StateConstructor} from "../common/state";
import {fetchExpenses, FetchExpensesOutput} from "../api/fetch-expenses";
import classes from './ExpenseDashboard.module.css'
import {ExpenseTable} from "./ExpenseTable";
import {parseTags} from "../common/tag";


export const ExpenseDashboard = () => {
    type Filter = {
        startTime?: Date,
        endTime?: Date,
        tags: string[],
    }

    const [filter, setFilter] = React.useState<Filter>({
        startTime: undefined,
        endTime: undefined,
        tags: [],
    })

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
            />
            <label htmlFor="end-time">End time</label>
            <input
                onChange={onEndTimeChange}
                id="end-time"
                type="datetime-local"
            />
            <label htmlFor="tags">Tags</label>
            <input
                onChange={onTagsChange}
                id="tags"
                type="search"
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