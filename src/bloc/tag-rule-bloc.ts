import {TagRuleApi} from "../api/tag-rule-api";
import {BlocHelper} from "./bloc-helper";
import {clearCombinedCache} from "./combined-bloc";

export type TagRuleBlocRule = {
    isPartOf: string[],
}

export const TagRuleBloc = {
    edit: BlocHelper.wrapWithStateCallback(
        async (input: {
            tag: string,
            rule: TagRuleBlocRule,
        }): Promise<void> => {
            clearCombinedCache()

            await TagRuleApi.edit(input)
        },
    ),
    delete: BlocHelper.wrapWithStateCallback(
        async (input: {
            tag: string,
        }): Promise<void> => {
            clearCombinedCache()

            await TagRuleApi.edit({
                tag: input.tag,
                rule: {
                    isPartOf: [],
                },
            })
        },
    ),
}