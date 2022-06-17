import {Link} from "react-router-dom";
import classes from "./NewExpensePage.module.css";
import React from "react";

export const ManageTagsPage = () => {
    return <>
        <h1>Manage Tags</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
    </>
}