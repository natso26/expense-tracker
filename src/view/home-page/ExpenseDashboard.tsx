import React, {ChangeEvent} from "react";
import {State, StateConstructor} from "../../common/state";
import classes from './ExpenseDashboard.module.css'
import {ExpenseTable} from "./ExpenseTable";
import {parseTags, serializeTags} from "../../common/tag";
import {parseDate, serializeForDateInput} from "../../common/date";
import {CombinedBloc, CombinedBlocGetExpensesOutput} from "../../bloc/combined-bloc";

export type ExpenseDashboardData = {
    defaultFilter: ExpenseDashboardDataFilter,
    filter: ExpenseDashboardDataFilter,
    setFilterCallback: (filter: ExpenseDashboardDataFilter) => void,
}

export type ExpenseDashboardDataFilter = {
    date?: Date,
    title: string,
    tags: string[],
}

export const ExpenseDashboard = (props: {
    data: ExpenseDashboardData,
}) => {
    type Filter = {
        date?: Date,
        title: string,
        tags: string[],
    }

    const [filter, setFilter] = React.useState<Filter>(props.data.filter)

    const [fetchExpensesOutput, setFetchExpensesOutput] = React.useState<State<CombinedBlocGetExpensesOutput>>(
        StateConstructor.IniState(),
    )

    const setFilterCallback = props.data.setFilterCallback

    React.useEffect(() => {
        (async () => {
            setFilterCallback(filter)

            await CombinedBloc.getExpenses({filter}, setFetchExpensesOutput)
        })()
    }, [setFilterCallback, filter])

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            date: parseDate(e.target.value),
        }))
    }

    const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            title: e.target.value.trim().toLowerCase(),
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
            document.querySelector<HTMLInputElement>('#title')!.value = ''
            document.querySelector<HTMLInputElement>('#tags')!.value = ''

            return {
                date: undefined,
                title: '',
                tags: [],
            }
        })
    }

    const defaultFilter = props.data.defaultFilter

    const isFilterNonEmpty = Boolean(filter.date || filter.title || filter.tags.length)

    return <>
        <div className={classes['input-grid']}>
            <label htmlFor="date">Date</label>
            <input
                onChange={onDateChange}
                id="date"
                type="date"
                defaultValue={serializeForDateInput(defaultFilter.date)}
            />
            <label htmlFor="title">Title</label>
            <input
                onChange={onTitleChange}
                id="title"
                type="search"
                defaultValue={defaultFilter.title}
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
                        <ExpenseTable data={
                            fetchExpensesOutput.data
                        }/>
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