import {Link} from "react-router-dom";
import React from "react";
import {VerticalMargin} from "../components/vertical-margin";

export const ExportPage = () => {
    return <>
        <h1>Export</h1>
        <VerticalMargin>
            <Link to={-1 as any}>Back</Link>
        </VerticalMargin>
        <p>Coming soon!</p>
    </>
}