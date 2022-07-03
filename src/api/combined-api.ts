import {databaseDomain} from "./const";
import {ExpenseApiExpense} from "./expense-api";
import {TagRuleApiRule} from "./tag-rule-api";

export type CombinedApiFetchOutput = {
    expenses: Map<string, ExpenseApiExpense>,
    tagRules: Map<string, TagRuleApiRule>,
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
            tagRules: new Map(Object.entries<{
                isPartOf?: string[],
            }>(data?.tagRule ?? {}).map(([tag, rule]) => [
                tag,
                {
                    isPartOf: rule.isPartOf ?? [],
                },
            ])),
        }
    },
}