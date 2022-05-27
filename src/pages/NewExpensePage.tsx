import {NewExpenseForm} from "../components/NewExpenseForm";
import {Link, useNavigate} from "react-router-dom";
import classes from './NewExpensePage.module.css'
import React from "react";

export const NewExpensePage = () => {
    const navigate = useNavigate()

    const onFormSubmitCallback = React.useCallback(() => {
        navigate('/')
    }, [navigate])

    return <>
        <h1>New Expense</h1>
        <div className={classes['vertical-space']}>
            <Link to='/'>Back</Link>
        </div>
        <NewExpenseForm data={{
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}