import React from "react";
import {parseExpense} from "../../../common/expense";
import {serializeForDateTimeInput} from "../../../common/date";
import {ExpenseBloc} from "../../../bloc/expense-bloc";
import {useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {StateComponent} from "../../components/state";
import {InputGrid} from "../../components/input-grid";
import {VerticalMargin} from "../../components/vertical-margin";

export const NewExpenseForm = (props: {
    data: {
        timestamp: Date,
        onSubmitCallback: () => void,
    },
}) => {
    const {timestamp, onSubmitCallback} = props.data

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

            if (state.state === 'DATA') onSubmitCallback()
        })
    }

    switch (submit.state) {
        case "INIT":
            return (
                <form onSubmit={onSubmit}>
                    <InputGrid>
                        <label htmlFor="timestamp">Time</label>
                        <input
                            ref={timestampRef} id="timestamp"
                            type="datetime-local"
                            defaultValue={serializeForDateTimeInput(timestamp)}
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
                    </InputGrid>
                    <VerticalMargin>
                        <button>Submit</button>
                    </VerticalMargin>
                </form>
            )

        case "LOADING":
            return (
                <StateComponent.Loading/>
            )

        case "DATA":
            return (
                <StateComponent.Success/>
            )

        case "ERROR":
            return (
                <StateComponent.Error data={{
                    error: submit.error,
                }}/>
            )
    }
}