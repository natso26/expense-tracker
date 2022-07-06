import React, {ChangeEvent} from "react";
import {DashboardContents} from "./DashboardContents";
import {parseTags, serializeTags} from "../../../common/tag";
import {parseDate, serializeForDateInput} from "../../../common/date";
import {CombinedBloc} from "../../../bloc/combined-bloc";
import {useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {fieldLens, Lens, useLens} from "../../view-utils/hooks/lens";
import {StateComponent} from "../../components/state";
import {UseState} from "../../view-utils/type";
import {InputGrid} from "../../components/input-grid";
import {VerticalMargin} from "../../components/vertical-margin";
import {State} from "../../../common/state";

export type DashboardDataQuery = {
    view: Parameters<typeof DashboardContents>[0]['data']['query']['view'] extends UseState<infer T> ? T : never,
    filter: Filter,
    tagSearch: Parameters<typeof DashboardContents>[0]['data']['query']['tagSearch'] extends UseState<infer T> ? T : never,
}

export const Dashboard = (props: {
    data: {
        query: UseState<DashboardDataQuery>,
    },
}) => {
    const {
        query: [query, setQuery],
    } = props.data

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
        useWrappedState<Parameters<Parameters<typeof CombinedBloc.getExpenses>[1]>[0] extends State<infer T> ? T : never>()

    const updateExpenses = (filter: Filter) =>
        CombinedBloc.getExpenses({filter}, setFetchExpensesOutput)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => updateExpenses(filter), [])

    const setFilterAndUpdateExpenses = (action: (filter: Filter) => Filter) =>
        setFilter((filter) => {
            const nextFilter = action(filter)

            updateExpenses(nextFilter)

            return nextFilter
        })

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterAndUpdateExpenses((filter) => ({
            ...filter,
            date: parseDate(e.target.value) || undefined,
        }))
    }

    const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterAndUpdateExpenses((filter) => ({
            ...filter,
            title: e.target.value.trim().toLowerCase(),
        }))
    }

    const onTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterAndUpdateExpenses((filter) => ({
            ...filter,
            tags: parseTags(e.target.value),
        }))
    }

    const onClickClearFilter = () => {
        setFilterAndUpdateExpenses(() => {
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

    const isFilterDisabled = view !== 'expenses'

    const showClearFilter = Boolean(date || title || tags.length) && !isFilterDisabled

    return <>
        <InputGrid>
            <label htmlFor="date">Date</label>
            <input
                onChange={onDateChange}
                id="date"
                type="date"
                defaultValue={serializeForDateInput(initialDate || null)}
                disabled={isFilterDisabled}
            />
            <label htmlFor="title">Title</label>
            <input
                onChange={onTitleChange}
                id="title"
                type="search"
                defaultValue={initialTitle}
                disabled={isFilterDisabled}
            />
            <label htmlFor="tags">Tags</label>
            <input
                onChange={onTagsChange}
                id="tags"
                type="search"
                placeholder={tagsInputPlaceholder}
                defaultValue={serializeTags(initialTags)}
                disabled={isFilterDisabled}
            />
        </InputGrid>
        {showClearFilter && (
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
                                view: [view, setView],
                                tagSearch: [tagSearch, setTagSearch],
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