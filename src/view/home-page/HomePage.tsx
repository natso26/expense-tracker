import React from "react";
import classes from './HomePage.module.css'
import {Link, useSearchParams} from "react-router-dom";
import {Dashboard, DashboardDataFilter} from "./Dashboard";
import {compactSerializeTags, parseTags} from "../../common/tag";
import {parseDateTime} from "../../common/date";

export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [initialSearchParams] = React.useState<URLSearchParams>(searchParams)

    const parseFilter = (params: URLSearchParams): DashboardDataFilter => ({
        date: parseDateTime(params.get('date') ?? ''),
        title: params.get('title') ?? '',
        tags: parseTags(params.get('tags') ?? ''),
    })

    const setFilterCallback = React.useCallback((filter: DashboardDataFilter) => {
        setSearchParams(Object.fromEntries(Object.entries({
            date: filter.date?.toISOString() ?? '',
            title: filter.title,
            tags: compactSerializeTags(filter.tags),
        }).filter(
            ([, v]) => v,
        )), {
            replace: true,
        })
    }, [setSearchParams])

    return <>
        <h1>Expense Tracker</h1>
        <div className={[classes['vertical-space'], classes['space-between']].join(' ')}>
            <Link to='/new-expense'>New expense</Link>
            <Link to='/summary'>Summary</Link>
        </div>
        <Dashboard data={{
            defaultFilter: parseFilter(initialSearchParams),
            filter: parseFilter(searchParams),
            setFilterCallback,
        }}/>
    </>
}