import React from "react";
import {State, StateConstructor} from "../common/state";
import classes from "./EditExpenseForm.module.css";
import {editExpense} from "../api/edit-expense";
import {parseExpense, serializeExpense} from "../common/expense";
import {serializeDateForInput} from "../common/date";
import {deleteExpense} from "../api/delete-expense";

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
    const [submit, setSubmit] = React.useState<State<null>>(StateConstructor.IniState())

    const timestampRef = React.useRef<HTMLInputElement>(null)
    const titleRef = React.useRef<HTMLInputElement>(null)
    const amountRef = React.useRef<HTMLInputElement>(null)
    const tagsRef = React.useRef<HTMLInputElement>(null)


    const serializedExpense = serializeExpense(props.data.expense)

    const onSubmit = async (e: any) => {
        e.preventDefault()

        setSubmit(StateConstructor.LoadingState())

        const input = {
            id: props.data.expense.id,
            ...parseExpense({
                timestamp: timestampRef.current!.value,
                title: titleRef.current!.value,
                amount: amountRef.current!.value,
                tags: tagsRef.current!.value,
            }),
        }

        console.log(input)

        try {
            await editExpense(input)

            setSubmit(StateConstructor.DataState(null))

            props.data.onSubmitCallback()

        } catch (e) {
            setSubmit(StateConstructor.ErrorState(e))
        }
    }

    const onClickDelete = async (e: any) => {
        e.preventDefault()

        const confirmResp = window.confirm('Confirm deletion?')

        console.log(confirmResp)

        if (!confirmResp) return

        setSubmit(StateConstructor.LoadingState())

        try {
            await deleteExpense({
                id: props.data.expense.id,
            })

            setSubmit(StateConstructor.DataState(null))

            props.data.onSubmitCallback()

        } catch (e) {
            setSubmit(StateConstructor.ErrorState(e))
        }
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
                            required
                            defaultValue={serializeDateForInput(props.data.expense.timestamp)}
                        />
                        <label htmlFor="title">Title</label>
                        <input
                            ref={titleRef} id="title"
                            type="text"
                            required
                            defaultValue={serializedExpense.title}
                        />
                        <label htmlFor="amount">Amount</label>
                        <input
                            ref={amountRef} id="amount"
                            type="number"
                            required
                            min="0.01" step="0.01"
                            defaultValue={serializedExpense.amount}
                        />
                        <label htmlFor="tags">Tags</label>
                        <input
                            ref={tagsRef} id="tags"
                            type="text"
                            defaultValue={serializedExpense.tags}
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