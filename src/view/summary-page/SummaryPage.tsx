import {Link} from "react-router-dom";
import classes from "./SummaryPage.module.css";
import React from "react";

export const SummaryPage = () => {
    return <>
        <h1>Summary</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
        <p>Coming soon!</p>
    </>
}