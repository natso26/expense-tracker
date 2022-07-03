import React, {ChangeEvent} from "react";
import classes from './Dashboard.module.css'
import {DashboardContents} from "./DashboardContents";
import {parseTags, serializeTags} from "../../../common/tag";
import {parseDate, serializeForDateInput} from "../../../common/date";
import {CombinedBloc, CombinedBlocGetExpensesOutput} from "../../../bloc/combined-bloc";
import {useEffectSkipInitial, useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {Lens, useLens} from "../../view-utils/hooks/lens";
import {StateComponent} from "../../components/state";
import {GetSet} from "../../view-utils/type";

export type DashboardData = {
    query: GetSet<DashboardDataQuery>,
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

    const {query: {get: getQuery, set: setQueryCallback}} = props.data

    const [query, setQuery] = React.useState<DashboardDataQuery>(getQuery())

    const [view, setView] = useLens<DashboardDataQuery, DashboardDataQueryView>(
        [query, setQuery], queryViewLens,
    )

    const [filter, setFilter] = useLens<DashboardDataQuery, Filter>(
        [query, setQuery], queryFilterLens,
    )

    const [tagSearch, setTagSearch] = useLens<DashboardDataQuery, DashboardDataQueryTagSearch>(
        [query, setQuery], queryTagSearchLens,
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
                            <StateComponent.Loading/>
                        </div>
                    )

                case "DATA":
                    return (
                        <DashboardContents data={{
                            data: fetchExpensesOutput.data,
                            query: {
                                view: {
                                    get: () => view,
                                    set: setView,
                                },
                                tagSearch: {
                                    get: () => tagSearch,
                                    set: setTagSearch,
                                },
                            },
                        }}/>
                    )

                case "ERROR":
                    return (
                        <div className={classes.error}>
                            <StateComponent.Error data={{
                                error: fetchExpensesOutput.error,
                            }}/>
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

const queryTagSearchLens: Lens<DashboardDataQuery, DashboardDataQueryTagSearch> = {
    view: (query) => query.tagSearch,
    set: (query, tagSearch) => ({...query, tagSearch}),
}