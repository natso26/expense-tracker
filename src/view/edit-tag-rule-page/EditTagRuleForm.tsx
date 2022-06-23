import React from "react";
import {State, StateConstructor} from "../../common/state";
import classes from "./EditTagRuleForm.module.css";
import {serializeTags} from "../../common/tag";
import {TagRuleBloc} from "../../bloc/tag-rule-bloc";
import {parseTagRule} from "../../common/tag-rule";

export type EditTagRuleFormData = {
    tag: string,
    rule: EditTagRuleFormRule,
    onSubmitCallback: () => void,
}

export type EditTagRuleFormRule = {
    isPartOf: string[],
}

export const EditTagRuleForm = (props: {
    data: EditTagRuleFormData,
}) => {
    const [submit, setSubmit] = React.useState<State<void>>(StateConstructor.IniState())

    const isPartOfRef = React.useRef<HTMLInputElement>(null)

    const tag = props.data.tag
    const rule = props.data.rule

    const onSubmit = async (e: any) => {
        e.preventDefault()

        const input = {
            tag,
            rule: parseTagRule({
                isPartOf: isPartOfRef.current!.value,
            }),
        }

        await TagRuleBloc.edit(input, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') props.data.onSubmitCallback()
        })
    }

    const onClickDelete = async (e: any) => {
        e.preventDefault()

        const confirmResp = window.confirm('Confirm deletion?')

        if (!confirmResp) return

        await TagRuleBloc.delete({tag}, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') props.data.onSubmitCallback()
        })
    }

    switch (submit.state) {
        case "INIT":
            return (
                <form onSubmit={onSubmit}>
                    <div className={classes['input-grid']}>
                        <label htmlFor="tag">Tag</label>
                        <input
                            id="tag"
                            type="text"
                            value={tag}
                            disabled
                        />
                        <label htmlFor="isPartOf">Is part of</label>
                        <input
                            ref={isPartOfRef} id="isPartOf"
                            type="text"
                            placeholder="tag 1, tag 2"
                            defaultValue={serializeTags(rule.isPartOf)}
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