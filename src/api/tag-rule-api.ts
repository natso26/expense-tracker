import {databaseDomain} from "./const";

export type TagRuleApiRule = {
    isPartOf: string[],
}

export const TagRuleApi = {
    edit: async (input: {
        tag: string,
        rule: TagRuleApiRule,
    }): Promise<void> => {
        const response = await fetch(
            `${databaseDomain}/tagRule/${input.tag}.json`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input.rule),
            },
        )

        if (!response.ok) {
            const error = await response.text()

            throw Error(error)
        }
    },
}