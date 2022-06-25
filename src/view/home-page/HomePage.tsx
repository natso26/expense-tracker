import React from "react";
import classes from './HomePage.module.css'
import {Link, useSearchParams} from "react-router-dom";
import {Dashboard, DashboardDataQuery} from "./Dashboard";
import {compactSerializeTags, parseTags} from "../../common/tag";
import {parseDateTime} from "../../common/date";

export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [initialSearchParams] = React.useState<URLSearchParams>(searchParams)

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

    return <>
        <h1>Expense Tracker</h1>
        <div className={[classes['vertical-space'], classes['space-between']].join(' ')}>
            <Link to='/new-expense'>New expense</Link>
            <Link to='/export'>Export</Link>
        </div>
        <Dashboard data={{
            defaultQuery: parseQuery(initialSearchParams),
            query: parseQuery(searchParams),
            setQueryCallback,
        }}/>
    </>
}