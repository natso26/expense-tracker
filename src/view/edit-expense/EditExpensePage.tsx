import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import classes from "./EditExpensePage.module.css";
import React from "react";
import {EditExpenseForm} from "./form/EditExpenseForm";
import {parseExpense} from "../../common/expense";
import {useNavigateBack} from "../view-utils/hooks/helper";


export const EditExpensePage = () => {
    const {id} = useParams()
    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    const onFormSubmitCallback = useNavigateBack(navigate)

    return <>
        <h1>Edit Expense</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
        <EditExpenseForm data={{
            id: id!,
            expense: parseExpense({
                timestamp: searchParams.get('timestamp') ?? '',
                title: searchParams.get('title') ?? '',
                amount: searchParams.get('amount') ?? '',
                tags: searchParams.get('tags') ?? '',
            }),
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}