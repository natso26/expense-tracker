import {Link} from "react-router-dom";
import classes from "./ExportPage.module.css";
import React from "react";

export const ExportPage = () => {
    return <>
        <h1>Export</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
        <p>Coming soon!</p>
    </>
}