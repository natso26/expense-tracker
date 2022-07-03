import React, {ChangeEvent} from "react";
import {DashboardContents} from "./DashboardContents";
import {parseTags, serializeTags} from "../../../common/tag";
import {parseDate, serializeForDateInput} from "../../../common/date";
import {CombinedBloc} from "../../../bloc/combined-bloc";
import {useEffectSkipInitial, useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {fieldLens, Lens, useLens} from "../../view-utils/hooks/lens";
import {StateComponent} from "../../components/state";
import {GetSet} from "../../view-utils/type";
import {InputGrid} from "../../components/input-grid";
import {VerticalMargin} from "../../components/vertical-margin";
import {State} from "../../../common/state";

export type DashboardDataQuery = {
    view: Parameters<typeof DashboardContents>[0]['data']['query']['view'] extends GetSet<infer T> ? T : never,
    filter: Filter,
    tagSearch: Parameters<typeof DashboardContents>[0]['data']['query']['tagSearch'] extends GetSet<infer T> ? T : never,
}

export const Dashboard = (props: {
    data: {
        query: GetSet<DashboardDataQuery>,
    },
}) => {
    const {
        query: {get: getQuery, set: setQueryCallback},
    } = props.data

    const [query, setQuery] = React.useState<DashboardDataQuery>(getQuery())

    const [view, setView] = useLens([query, setQuery], queryViewLens)

    const [filter, setFilter] = useLens([query, setQuery], queryFilterLens)
    const {date, title, tags} = filter

    const [tagSearch, setTagSearch] = useLens([query, setQuery], queryTagSearchLens)

    const [{
        date: initialDate,
        title: initialTitle,
        tags: initialTags,
    }] = React.useState<Filter>(filter)

    const [fetchExpensesOutput, setFetchExpensesOutput] =
        useWrappedState<Parameters<Parameters<typeof CombinedBloc.getExpenses>[1]>[0] extends State<infer I> ? I : never>()

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

    const isFilterNonEmpty = Boolean(date || title || tags.length)

    return <>
        <InputGrid>
            <label htmlFor="date">Date</label>
            <input
                onChange={onDateChange}
                id="date"
                type="date"
                defaultValue={serializeForDateInput(initialDate || null)}
            />
            <label htmlFor="title">Title</label>
            <input
                onChange={onTitleChange}
                id="title"
                type="search"
                defaultValue={initialTitle}
            />
            <label htmlFor="tags">Tags</label>
            <input
                onChange={onTagsChange}
                id="tags"
                type="search"
                placeholder={tagsInputPlaceholder}
                defaultValue={serializeTags(initialTags)}
            />
        </InputGrid>
        {isFilterNonEmpty && (
            <VerticalMargin>
                <button onClick={onClickClearFilter}>Clear filter</button>
            </VerticalMargin>
        )}
        {(() => {
            switch (fetchExpensesOutput.state) {
                case "INIT":
                    return null

                case "LOADING":
                    return (
                        <StateComponent.Loading/>
                    )

                case "DATA":
                    return (
                        <DashboardContents data={{
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
                            result: fetchExpensesOutput.data,
                        }}/>
                    )

                case "ERROR":
                    return (
                        <StateComponent.Error data={{
                            error: fetchExpensesOutput.error,
                        }}/>
                    )
            }
        })()}
    </>
}

type Filter = {
    date?: Date,
    title: string,
    tags: string[],
}

const queryFilterLens: Lens<DashboardDataQuery, DashboardDataQuery['filter']> = fieldLens('filter')

const queryViewLens: Lens<DashboardDataQuery, DashboardDataQuery['view']> = fieldLens('view')

const queryTagSearchLens: Lens<DashboardDataQuery, DashboardDataQuery['tagSearch']> = fieldLens('tagSearch')