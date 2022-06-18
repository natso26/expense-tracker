import {databaseDomain} from "./domain";

export type TagRelationApiEditInput = {
    tag: string,
    relation: TagRelationApiRelation,
}

export type TagRelationApiRelation = {
    isPartOf: string[],
}

export const TagRelationApi = {
    edit: async (input: TagRelationApiEditInput): Promise<void> => {
        const response = await fetch(
            `${databaseDomain}/tagRelation/${input.tag}.json`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input.relation),
            },
        )

        if (!response.ok) {
            const error = await response.text()

            throw Error(error)
        }
    },
}