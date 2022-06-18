import React from "react";
import {State, StateConstructor} from "../../common/state";
import classes from "./NewExpenseForm.module.css";
import {parseExpense} from "../../common/expense";
import {serializeForDateTimeInput} from "../../common/date";
import {ExpenseBloc} from "../../bloc/expense-bloc";

export type NewExpenseFormData = {
    timestamp: Date,
    onSubmitCallback: () => void,
}

export const NewExpenseForm = (props: {
    data: NewExpenseFormData,
}) => {
    const [submit, setSubmit] = React.useState<State<void>>(StateConstructor.IniState())

    const timestampRef = React.useRef<HTMLInputElement>(null)
    const titleRef = React.useRef<HTMLInputElement>(null)
    const amountRef = React.useRef<HTMLInputElement>(null)
    const tagsRef = React.useRef<HTMLInputElement>(null)

    const onSubmit = async (e: any) => {
        e.preventDefault()

        const input = {
            expense: parseExpense({
                timestamp: timestampRef.current!.value,
                title: titleRef.current!.value,
                amount: amountRef.current!.value,
                tags: tagsRef.current!.value,
            }),
        }

        await ExpenseBloc.add(input, (state) => {
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
                            required
                            defaultValue={serializeForDateTimeInput(props.data.timestamp)}
                        />
                        <label htmlFor="title">Title</label>
                        <input
                            ref={titleRef} id="title"
                            type="text"
                        />
                        <label htmlFor="amount">Amount</label>
                        <input
                            ref={amountRef} id="amount"
                            type="number"
                            min="0" step="0.01"
                        />
                        <label htmlFor="tags">Tags</label>
                        <input
                            ref={tagsRef} id="tags"
                            type="text"
                            placeholder="tag 1, tag 2"
                        />
                    </div>
                    <div className={classes['vertical-space']}>
                        <button>Submit</button>
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