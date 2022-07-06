import React from "react";
import {parseExpense, serializeAmount} from "../../../common/expense";
import {serializeForDateTimeInput} from "../../../common/date";
import {serializeTags} from "../../../common/tag";
import {ExpenseBloc} from "../../../bloc/expense-bloc";
import {useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {StateComponent} from "../../components/state";
import {InputGrid} from "../../components/input-grid";
import {VerticalMargin} from "../../components/vertical-margin";
import {Button} from "../../components/button";

export const EditExpenseForm = (props: {
    data: {
        id: string,
        expense: {
            timestamp: Date,
            title: string,
            amount: number,
            tags: string[],
        },
        onSubmitCallback: () => void,
    },
}) => {
    const {
        id,
        expense: {timestamp, title, amount, tags},
        onSubmitCallback
    } = props.data

    const [submit, setSubmit] = useWrappedState<void>()

    const timestampRef = React.useRef<HTMLInputElement>(null)
    const titleRef = React.useRef<HTMLInputElement>(null)
    const amountRef = React.useRef<HTMLInputElement>(null)
    const tagsRef = React.useRef<HTMLInputElement>(null)

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

        ExpenseBloc.edit(input, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') onSubmitCallback()
        })
    }

    const onClickDelete = async (e: any) => {
        e.preventDefault()

        const confirmResp = window.confirm('Delete expense?')

        if (!confirmResp) return

        ExpenseBloc.delete({id}, (state) => {
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
                            defaultValue={title}
                        />
                        <label htmlFor="amount">Amount</label>
                        <input
                            ref={amountRef} id="amount"
                            type="number"
                            min="0" step="0.01"
                            defaultValue={serializeAmount(amount)}
                        />
                        <label htmlFor="tags">Tags</label>
                        <input
                            ref={tagsRef} id="tags"
                            type="text"
                            placeholder={tagsInputPlaceholder}
                            defaultValue={serializeTags(tags)}
                        />
                    </InputGrid>
                    <VerticalMargin>
                        <button>Submit</button>
                    </VerticalMargin>
                    <VerticalMargin onClick={onClickDelete}>
                        <Button.Delete>Delete</Button.Delete>
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