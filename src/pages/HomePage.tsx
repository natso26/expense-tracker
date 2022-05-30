import React from "react";
import classes from './HomePage.module.css'
import {Link, useSearchParams} from "react-router-dom";
import {ExpenseDashboard, ExpenseDashboardDataFilter} from "../components/ExpenseDashboard";
import {parseTags} from "../common/tag";

export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const parseDate = (date: string): Date | undefined => (
        date ? new Date(date) : undefined
    )

    const setFilterCallback = React.useCallback((filter: ExpenseDashboardDataFilter) => {
        setSearchParams(Object.fromEntries(Object.entries({
            startTime: filter.startTime?.toISOString() ?? '',
            endTime: filter.endTime?.toISOString() ?? '',
            tags: filter.tags.join(','),
        }).filter(
            ([k, v]) => v,
        )))
    }, [setSearchParams])

    return <>
        <h1>Expense Tracker</h1>
        <div className={classes['vertical-space']}>
            <Link to='/new-expense'>New expense</Link>
        </div>
        <ExpenseDashboard data={{
            filter: {
                startTime: parseDate(searchParams.get('startTime') ?? ''),
                endTime: parseDate(searchParams.get('endTime') ?? ''),
                tags: parseTags(searchParams.get('tags') ?? ''),
            },
            setFilterCallback: setFilterCallback,
        }}/>
    </>
}