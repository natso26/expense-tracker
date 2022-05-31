import React from "react";
import classes from './HomePage.module.css'
import {Link, useSearchParams} from "react-router-dom";
import {ExpenseDashboard, ExpenseDashboardDataFilter} from "../components/ExpenseDashboard";
import {compactSerializeTags, parseTags} from "../common/tag";
import {parseDate} from "../common/date";

export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [initialSearchParams] = React.useState<URLSearchParams>(searchParams)

    const parseFilter = (params: URLSearchParams): ExpenseDashboardDataFilter => ({
        startTime: parseDate(params.get('startTime') ?? ''),
        endTime: parseDate(params.get('endTime') ?? ''),
        tags: parseTags(params.get('tags') ?? ''),
    })

    const setFilterCallback = React.useCallback((filter: ExpenseDashboardDataFilter) => {
        setSearchParams(Object.fromEntries(Object.entries({
            startTime: filter.startTime?.toISOString() ?? '',
            endTime: filter.endTime?.toISOString() ?? '',
            tags: compactSerializeTags(filter.tags),
        }).filter(
            ([k, v]) => v,
        )), {
            replace: true,
        })
    }, [setSearchParams])

    return <>
        <h1>Expense Tracker</h1>
        <div className={classes['vertical-space']}>
            <Link to='/new-expense'>New expense</Link>
        </div>
        <ExpenseDashboard data={{
            defaultFilter: parseFilter(initialSearchParams),
            filter: parseFilter(searchParams),
            setFilterCallback: setFilterCallback,
        }}/>
    </>
}