import {databaseDomain} from "./domain";
import {ExpenseApiExpense} from "./expense-api";
import {TagRelationApiRelation} from "./tag-relation-api";

export type CombinedApiFetchOutput = {
    expenses: Map<string, ExpenseApiExpense>,
    tagRelations: Map<string, TagRelationApiRelation>,
}

export const CombinedApi = {
    fetch: async (): Promise<CombinedApiFetchOutput> => {
        const response = await fetch(
            `${databaseDomain}.json`,
        )

        if (!response.ok) {
            const error = await response.text()

            throw Error(error)
        }

        const data = await response.json()

        return {
            expenses: new Map(Object.entries<{
                timestamp: string,
                title: string,
                amount: number,
                tags?: string[],
            }>(data?.expense ?? {}).map(([id, expense]) => [
                id,
                {
                    timestamp: new Date(expense.timestamp),
                    title: expense.title,
                    amount: expense.amount,
                    tags: expense.tags ?? [],
                },
            ])),
            tagRelations: new Map(Object.entries<{
                isPartOf?: string[],
            }>(data?.tagRelation ?? {}).map(([tag, relation]) => [
                tag,
                {
                    isPartOf: relation.isPartOf ?? [],
                },
            ])),
        }
    },
}