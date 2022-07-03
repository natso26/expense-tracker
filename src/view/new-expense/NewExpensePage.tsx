import {NewExpenseForm} from "./form/NewExpenseForm";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import classes from './NewExpensePage.module.css'
import React from "react";
import {parseDateTime} from "../../common/date";
import {useNavigateBack} from "../view-utils/hooks/helper";

export const NewExpensePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    const onFormSubmitCallback = useNavigateBack(navigate)

    const searchParamsTimestamp = parseDateTime(searchParams.get('timestamp') ?? '')

    const timestamp = React.useMemo(() => (
        searchParamsTimestamp ?? new Date()
    ), [searchParamsTimestamp])

    React.useEffect(() => {
        if (!searchParamsTimestamp) {
            setSearchParams({
                timestamp: timestamp.toISOString(),
            }, {replace: true})
        }
    }, [searchParamsTimestamp, setSearchParams, timestamp])

    return <>
        <h1>New Expense</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
        <NewExpenseForm data={{
            timestamp,
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}