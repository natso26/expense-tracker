import {parseTags} from "./tag";

export const parseTagRule = (input: {
    isPartOf: string,
}): {
    isPartOf: string[],
} => ({
    isPartOf: parseTags(input.isPartOf),
})