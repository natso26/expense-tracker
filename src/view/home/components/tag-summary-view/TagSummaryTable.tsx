import {createSearchParams, useNavigate} from "react-router-dom";
import React, {MouseEvent} from "react";
import {serializeAmount} from "../../../../common/expense";
import {compactSerializeTags, serializeTags} from "../../../../common/tag";
import {Table} from "../../../components/table";

export const TagSummaryTable = (props: {
    data: {
        tagSummaries: Map<string, {
            amount?: number,
            isPartOf: string[],
        }>,
    },
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
        <Table.Table>
            <thead>
            <tr>
                <th>Tag</th>
                <Table.Header.Number>Amount</Table.Header.Number>
                <th>Is part of</th>
            </tr>
            </thead>
            <tbody>
            {tagSummaryEntries.flatMap(([tag, summary]) => [
                <tr key={tag} id={tag} onClick={onClickSummary}>
                    <td>{tag}</td>
                    <Table.Data.Number>{
                        serializeAmount(summary.amount || null) || '\u2013'
                    }</Table.Data.Number>
                    <td>{serializeTags(summary.isPartOf)}</td>
                </tr>
            ])}
            </tbody>
        </Table.Table>
    )
}