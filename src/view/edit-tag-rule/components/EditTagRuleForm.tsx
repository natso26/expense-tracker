import React from "react";
import {serializeTags} from "../../../common/tag";
import {TagRuleBloc} from "../../../bloc/tag-rule-bloc";
import {parseTagRule} from "../../../common/tag-rule";
import {useWrappedState} from "../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../view-utils/const";
import {StateComponent} from "../../components/state";
import {InputGrid} from "../../components/input-grid";
import {VerticalMargin} from "../../components/vertical-margin";
import {Button} from "../../components/button";

export const EditTagRuleForm = (props: {
    data: {
        tag: string,
        rule: {
            isPartOf: string[],
        },
        onSubmitCallback: () => void,
    },
}) => {
    const {
        tag,
        rule: {isPartOf},
        onSubmitCallback,
    } = props.data

    const [submit, setSubmit] = useWrappedState<void>()

    const isPartOfRef = React.useRef<HTMLInputElement>(null)

    const onSubmit = async (e: any) => {
        e.preventDefault()

        const input = {
            tag,
            rule: parseTagRule({
                isPartOf: isPartOfRef.current!.value,
            }),
        }

        TagRuleBloc.edit(input, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') onSubmitCallback()
        })
    }

    const onClickDelete = async (e: any) => {
        e.preventDefault()

        const confirmResp = window.confirm('Delete tag rule?')

        if (!confirmResp) return

        TagRuleBloc.delete({tag}, (state) => {
            setSubmit(state)

            if (state.state === 'DATA') onSubmitCallback()
        })
    }

    switch (submit.state) {
        case "INIT":
            return (
                <form onSubmit={onSubmit}>
                    <InputGrid>
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
                            placeholder={tagsInputPlaceholder}
                            defaultValue={serializeTags(isPartOf)}
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