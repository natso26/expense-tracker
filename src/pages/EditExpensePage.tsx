import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import classes from "./NewExpensePage.module.css";
import React from "react";
import {EditExpenseForm} from "../components/EditExpenseForm";
import {parseExpense} from "../common/expense";


export const EditExpensePage = () => {
    const {id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    const onFormSubmitCallback = React.useCallback(() => {
        navigate(-1)
    }, [navigate])

    return <>
        <h1>Edit Expense</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
        <EditExpenseForm data={{
            expense: {
                id: id!,
                ...parseExpense({
                    timestamp: searchParams.get('timestamp')!,
                    title: searchParams.get('title')!,
                    amount: searchParams.get('amount')!,
                    tags: searchParams.get('tags')!,
                }),
            },
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}