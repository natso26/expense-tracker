import {Store} from "./store";
import {TagRuleApi} from "../api/tag-rule-api";
import {BlocHelper} from "./bloc-helper";

export type TagRuleBlocRule = {
    isPartOf: string[],
}

export const TagRuleBloc = {
    edit: BlocHelper.wrapWithStateCallback(
        async (input: {
            tag: string,
            rule: TagRuleBlocRule,
        }): Promise<void> => {
            Store.clear()

            await TagRuleApi.edit(input)
        },
    ),
    delete: BlocHelper.wrapWithStateCallback(
        async (input: {
            tag: string,
        }): Promise<void> => {
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