import React from "react";
import classes from "./EditExpenseForm.module.css";
import {parseExpense, serializeAmount} from "../../../common/expense";
import {serializeForDateTimeInput} from "../../../common/date";
import {serializeTags} from "../../../common/tag";
import {ExpenseBloc} from "../../../bloc/expense-bloc";
import {useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {StateComponent} from "../../components/state";

export type EditExpenseFormData = {
    id: string,
    expense: EditExpenseFormDataExpense,
    onSubmitCallback: () => void,
}

export type EditExpenseFormDataExpense = {
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const EditExpenseForm = (props: {
    data: EditExpenseFormData,
}) => {
    const [submit, setSubmit] = useWrappedState<void>()

    const timestampRef = React.useRef<HTMLInputElement>(null)
    const titleRef = React.useRef<HTMLInputElement>(null)
    const amountRef = React.useRef<HTMLInputElement>(null)
    const tagsRef = React.useRef<HTMLInputElement>(null)

    const {id, expense} = props.data

    const onSubmit = async (e: any) => {
        e.preventDefault()

        const input = {
            id,
            expense: parseExpense({
                timestamp: timestampRef.current!.value,
                title: titleRef.current!.value,
                amount: amountRef.current!.value,
                tags: tagsRef.current!.value,
            }),
        }

        await ExpenseBloc.edit(input, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') props.data.onSubmitCallback()
        })
    }

    const onClickDelete = async (e: any) => {
        e.preventDefault()

        const confirmResp = window.confirm('Delete expense-view?')

        if (!confirmResp) return

        await ExpenseBloc.delete({id}, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') props.data.onSubmitCallback()
        })
    }

    switch (submit.state) {
        case "INIT":
            return (
                <form onSubmit={onSubmit}>
                    <div className={classes['input-grid']}>
                        <label htmlFor="timestamp">Time</label>
                        <input
                            ref={timestampRef} id="timestamp"
                            type="datetime-local"
                            defaultValue={serializeForDateTimeInput(expense.timestamp)}
                        />
                        <label htmlFor="title">Title</label>
                        <input
                            ref={titleRef} id="title"
                            type="text"
                            defaultValue={expense.title}
                        />
                        <label htmlFor="amount">Amount</label>
                        <input
                            ref={amountRef} id="amount"
                            type="number"
                            min="0" step="0.01"
                            defaultValue={serializeAmount(expense.amount)}
                        />
                        <label htmlFor="tags">Tags</label>
                        <input
                            ref={tagsRef} id="tags"
                            type="text"
                            placeholder={tagsInputPlaceholder}
                            defaultValue={serializeTags(expense.tags)}
                        />
                    </div>
                    <div className={classes['vertical-space']}>
                        <button>Submit</button>
                    </div>
                    <div className={classes['vertical-space']} onClick={onClickDelete}>
                        <button className={classes['delete-btn']}>Delete</button>
                    </div>
                </form>
            )

        case "LOADING":
            return (
                <div className={classes.loading}>
                    <StateComponent.Loading/>
                </div>
            )

        case "DATA":
            return (
                <div className={classes.success}>
                    <StateComponent.Success/>
                </div>
            )

        case "ERROR":
            return (
                <div className={classes.error}>
                    <StateComponent.Error data={{
                        error: submit.error,
                    }}/>
                </div>
            )
    }
}