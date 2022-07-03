import {createSearchParams, useNavigate} from "react-router-dom";
import React, {MouseEvent} from "react";
import {serializeAmount} from "../../../../common/expense";
import {compactSerializeTags, serializeTags} from "../../../../common/tag";
import classes from "./TagSummaryTable.module.css";

export type TagSummaryTableData = {
    tagSummaries: Map<string, TagSummaryTableDataSummary>,
}

export type TagSummaryTableDataSummary = {
    amount?: number,
    isPartOf: string[],
}

export const TagSummaryTable = (props: {
    data: TagSummaryTableData,
}) => {
    const {tagSummaries} = props.data

    const navigate = useNavigate()

    const onClickSummary = (e: MouseEvent<HTMLTableRowElement>) => {
        const tag = e.currentTarget.id
        const summary = tagSummaries.get(tag)!

        navigate({
            pathname: `/edit-tag-rule/${tag}`,
            search: createSearchParams({
                isPartOf: compactSerializeTags(summary.isPartOf),
            }).toString(),
        })
    }

    const tagSummaryEntries = [...tagSummaries]

    return (
        <table className={classes['styled-table']}>
            <thead>
            <tr>
                <th>Tag</th>
                <th className={classes.number}>Amount</th>
                <th>Is part of</th>
            </tr>
            </thead>
            <tbody>
            {tagSummaryEntries.flatMap(([tag, summary]) => [
                <tr key={tag} id={tag} onClick={onClickSummary}>
                    <td>{tag}</td>
                    <td className={classes.number}>{
                        serializeAmount(summary.amount || null) || '\u2013'
                    }</td>
                    <td>{serializeTags(summary.isPartOf)}</td>
                </tr>
            ])}
            </tbody>
        </table>
    )
}