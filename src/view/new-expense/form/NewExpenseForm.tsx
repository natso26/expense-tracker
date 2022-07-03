import React from "react";
import classes from "./NewExpenseForm.module.css";
import {parseExpense} from "../../../common/expense";
import {serializeForDateTimeInput} from "../../../common/date";
import {ExpenseBloc} from "../../../bloc/expense-bloc";
import {useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {StateComponent} from "../../components/state";

export type NewExpenseFormData = {
    timestamp: Date,
    onSubmitCallback: () => void,
}

export const NewExpenseForm = (props: {
    data: NewExpenseFormData,
}) => {
    const [submit, setSubmit] = useWrappedState<void>()

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
                            placeholder={tagsInputPlaceholder}
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