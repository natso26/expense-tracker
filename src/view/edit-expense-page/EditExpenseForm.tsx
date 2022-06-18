import React from "react";
import {State, StateConstructor} from "../../common/state";
import classes from "./EditExpenseForm.module.css";
import {parseExpense, serializeExpense} from "../../common/expense";
import {serializeForDateTimeInput} from "../../common/date";
import {serializeTags} from "../../common/tag";
import {ExpenseBloc} from "../../bloc/expense-bloc";

export type EditExpenseFormData = {
    expense: EditExpenseFormDataExpense,
    onSubmitCallback: () => void,
}

export type EditExpenseFormDataExpense = {
    id: string,
    timestamp: Date,
    title: string,
    amount: number,
    tags: string[],
}

export const EditExpenseForm = (props: {
    data: EditExpenseFormData,
}) => {
    const [submit, setSubmit] = React.useState<State<void>>(StateConstructor.IniState())

    const timestampRef = React.useRef<HTMLInputElement>(null)
    const titleRef = React.useRef<HTMLInputElement>(null)
    const amountRef = React.useRef<HTMLInputElement>(null)
    const tagsRef = React.useRef<HTMLInputElement>(null)

    const onSubmit = async (e: any) => {
        e.preventDefault()

        const input = {
            id: props.data.expense.id,
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

        const confirmResp = window.confirm('Confirm deletion?')

        if (!confirmResp) return

        await ExpenseBloc.delete({
            id: props.data.expense.id,
        }, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') props.data.onSubmitCallback()
        })
    }

    const serializedExpense = serializeExpense(props.data.expense)

    switch (submit.state) {
        case "INIT":
            return (
                <form onSubmit={onSubmit}>
                    <div className={classes['input-grid']}>
                        <label htmlFor="timestamp">Time</label>
                        <input
                            ref={timestampRef} id="timestamp"
                            type="datetime-local"
                            required
                            defaultValue={serializeForDateTimeInput(props.data.expense.timestamp)}
                        />
                        <label htmlFor="title">Title</label>
                        <input
                            ref={titleRef} id="title"
                            type="text"
                            defaultValue={serializedExpense.title}
                        />
                        <label htmlFor="amount">Amount</label>
                        <input
                            ref={amountRef} id="amount"
                            type="number"
                            min="0" step="0.01"
                            defaultValue={serializedExpense.amount}
                        />
                        <label htmlFor="tags">Tags</label>
                        <input
                            ref={tagsRef} id="tags"
                            type="text"
                            placeholder="tag 1, tag 2"
                            defaultValue={serializeTags(props.data.expense.tags)}
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
                    <p>Loading...</p>
                </div>
            )

        case "DATA":
            return (
                <div className={classes.success}>
                    <p>Success</p>
                </div>
            )

        case "ERROR":
            return (
                <div className={classes.error}>
                    <p>Error:</p>
                    <p>{submit.error.message ?? 'Unknown error'}</p>
                </div>
            )
    }
}