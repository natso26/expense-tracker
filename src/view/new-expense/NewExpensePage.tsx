import {NewExpenseForm} from "./components/NewExpenseForm";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import React from "react";
import {parseDateTime} from "../../common/date";
import {useNavigateBack} from "../view-utils/hooks/helper";
import {VerticalMargin} from "../components/vertical-margin";

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
        <VerticalMargin>
            <Link to={-1 as any}>Back</Link>
        </VerticalMargin>
        <NewExpenseForm data={{
            timestamp,
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}