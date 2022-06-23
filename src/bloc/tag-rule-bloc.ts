import {Store} from "./store";
import {TagRuleApi} from "../api/tag-rule-api";
import {BlocHelper} from "./bloc-helper";

export type TagRuleBlocEditInput = {
    tag: string,
    rule: TagRuleBlocRule,
}

export type TagRuleBlocDeleteInput = {
    tag: string,
}

export type TagRuleBlocRule = {
    isPartOf: string[],
}

export const TagRuleBloc = {
    edit: BlocHelper.wrapWithStateCallback(
        async (input: TagRuleBlocEditInput): Promise<void> => {
            Store.clear()

            await TagRuleApi.edit(input)
        },
    ),
    delete: BlocHelper.wrapWithStateCallback(
        async (input: TagRuleBlocDeleteInput): Promise<void> => {
            Store.clear()

            await TagRuleApi.edit({
                tag: input.tag,
                rule: {
                    isPartOf: [],
                },
            })
        },
    ),
}