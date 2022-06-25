import React, {ChangeEvent} from "react";
import classes from './Dashboard.module.css'
import {DashboardContents} from "./DashboardContents";
import {parseTags, serializeTags} from "../../common/tag";
import {parseDate, serializeForDateInput} from "../../common/date";
import {CombinedBloc, CombinedBlocGetExpensesOutput} from "../../bloc/combined-bloc";
import {Lens, useEffectSkipInitial, useLens, useWrappedState} from "../view-utils/hooks";
import {tagsInputPlaceholder} from "../view-utils/const";

export type DashboardData = {
    query: DashboardDataQuery,
    setQueryCallback: (query: DashboardDataQuery) => void,
}

export type DashboardDataQuery = {
    view: DashboardDataQueryView,
    filter: DashboardDataQueryFilter,
    tagSearch: DashboardDataQueryTagSearch,
}

export type DashboardDataQueryView = 'expenses' | 'tags'

export type DashboardDataQueryFilter = {
    date?: Date,
    title: string,
    tags: string[],
}

export type DashboardDataQueryTagSearch = {
    name: string,
    isPartOf: string[],
}

export const Dashboard = (props: {
    data: DashboardData,
}) => {
    type Filter = {
        date?: Date,
        title: string,
        tags: string[],
    }

    const {setQueryCallback} = props.data

    const [query, setQuery] = React.useState<DashboardDataQuery>(props.data.query)

    const [view, setView] = useLens<DashboardDataQuery, DashboardDataQueryView>(
        [query, setQuery], queryViewLens,
    )

    const [filter, setFilter] = useLens<DashboardDataQuery, Filter>(
        [query, setQuery], queryFilterLens,
    )

    const [initialFilter] = React.useState<Filter>(filter)

    const [fetchExpensesOutput, setFetchExpensesOutput] = useWrappedState<CombinedBlocGetExpensesOutput>()

    useEffectSkipInitial(() => {
        setQueryCallback(query)
    }, [setQueryCallback, query])

    React.useEffect(() => {
        CombinedBloc.getExpenses({filter}, setFetchExpensesOutput)
    }, [filter, setFetchExpensesOutput])

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter((filter) => ({
            ...filter,
            date: parseDate(e.target.value) || undefined,
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

    const isFilterNonEmpty = Boolean(filter.date || filter.title || filter.tags.length)

    return <>
        <div className={classes['input-grid']}>
            <label htmlFor="date">Date</label>
            <input
                onChange={onDateChange}
                id="date"
                type="date"
                defaultValue={serializeForDateInput(initialFilter.date || null)}
            />
            <label htmlFor="title">Title</label>
            <input
                onChange={onTitleChange}
                id="title"
                type="search"
                defaultValue={initialFilter.title}
            />
            <label htmlFor="tags">Tags</label>
            <input
                onChange={onTagsChange}
                id="tags"
                type="search"
                placeholder={tagsInputPlaceholder}
                defaultValue={serializeTags(initialFilter.tags)}
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
                    return null

                case "LOADING":
                    return (
                        <div className={classes.loading}>
                            <p>Loading...</p>
                        </div>
                    )

                case "DATA":
                    return (
                        <DashboardContents data={{
                            data: fetchExpensesOutput.data,
                            view,
                            setViewCallback: setView,
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

const queryFilterLens: Lens<DashboardDataQuery, DashboardDataQueryFilter> = {
    view: (query) => query.filter,
    set: (query, filter) => ({...query, filter}),
}

const queryViewLens: Lens<DashboardDataQuery, DashboardDataQueryView> = {
    view: (query) => query.view,
    set: (query, view) => ({...query, view}),
}