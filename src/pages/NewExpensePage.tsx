import {NewExpenseForm} from "../components/NewExpenseForm";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import classes from './NewExpensePage.module.css'
import React from "react";
import {parseDateTime} from "../common/date";

export const NewExpensePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    const onFormSubmitCallback = React.useCallback(() => {
        navigate('/')
    }, [navigate])

    const searchParamsTimestamp = parseDateTime(searchParams.get('timestamp') ?? '')
    const timestamp = searchParamsTimestamp ?? new Date()

    React.useEffect(() => {
        if (!searchParamsTimestamp) {
            setSearchParams({
                timestamp: timestamp.toISOString(),
            }, {
                replace: true,
            })
        }
    }, [])

    return <>
        <h1>New Expense</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
        <NewExpenseForm data={{
            timestamp: timestamp,
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}