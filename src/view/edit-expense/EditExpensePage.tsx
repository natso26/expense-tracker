import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import React from "react";
import {EditExpenseForm} from "./components/EditExpenseForm";
import {parseExpense} from "../../common/expense";
import {useNavigateBack} from "../view-utils/hooks/helper";
import {VerticalMargin} from "../components/vertical-margin";

export const EditExpensePage = () => {
    const {id} = useParams()
    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    const onFormSubmitCallback = useNavigateBack(navigate)

    return <>
        <h1>Edit Expense</h1>
        <VerticalMargin>
            <Link to={-1 as any}>Back</Link>
        </VerticalMargin>
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