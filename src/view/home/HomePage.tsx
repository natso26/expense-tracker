import React from "react";
import {Link, useSearchParams} from "react-router-dom";
import {Dashboard, DashboardDataQuery} from "./components/Dashboard";
import {compactSerializeTags, parseTags} from "../../common/tag";
import {parseDateTime} from "../../common/date";
import {VerticalMargin} from "../components/vertical-margin";
import {MenuBar} from "../components/menu-bar";

export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const parseQuery = (params: URLSearchParams): DashboardDataQuery => ({
        view: params.get('view') === 'tags' ? 'tags' : 'expenses',
        filter: {
            date: parseDateTime(params.get('date') ?? '') || undefined,
            title: params.get('title') ?? '',
            tags: parseTags(params.get('tags') ?? ''),
        },
        tagSearch: {
            name: params.get('tagName') ?? '',
            isPartOf: parseTags(params.get('tagIsPartOf') ?? ''),
        },
    })

    const setQueryCallback = React.useCallback((query: DashboardDataQuery) => {
        const {
            view,
            filter: {date, title, tags,},
            tagSearch: {name, isPartOf},
        } = query

        setSearchParams(Object.fromEntries(Object.entries({
            view: view === 'expenses' ? '' : view,
            date: date?.toISOString() ?? '',
            title,
            tags: compactSerializeTags(tags),
            tagName: name,
            tagIsPartOf: compactSerializeTags(isPartOf),
        }).filter(
            ([, v]) => v,
        )), {replace: true})
    }, [setSearchParams])

    const query = parseQuery(searchParams)

    React.useEffect(() => {
        setQueryCallback(query)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>
        <h1>Expense Tracker</h1>
        <VerticalMargin>
            <MenuBar>
                <Link to='/new-expense'>New expense</Link>
                <Link to='/export'>Export</Link>
            </MenuBar>
        </VerticalMargin>
        <Dashboard data={{
            query: {
                get: () => query,
                set: setQueryCallback,
            },
        }}/>
    </>
}