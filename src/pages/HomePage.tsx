import React from "react";
import classes from './HomePage.module.css'
import {Link} from "react-router-dom";
import {ExpenseDashboard} from "../components/ExpenseDashboard";

export const HomePage = () => {
    return <>
        <h1>Expense Tracker</h1>
        <div className={classes['vertical-space']}>
            <Link to='/new-expense'>New expense</Link>
        </div>
        <ExpenseDashboard/>
    </>
}