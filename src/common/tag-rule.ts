import {parseTags} from "./tag";

export type ParseTagRuleInput = {
    isPartOf: string,
}

export type ParseTagRuleOutput = {
    isPartOf: string[],
}

export const parseTagRule = (input: ParseTagRuleInput): ParseTagRuleOutput => ({
    isPartOf: parseTags(input.isPartOf),
})