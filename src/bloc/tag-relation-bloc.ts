import {Store} from "./store";
import {TagRelationApi} from "../api/tag-relation-api";
import {BlocHelper} from "./bloc-helper";

export type TagRelationBlocEditInput = {
    tag: string,
    relation: TagRelationBlocRelation,
}

export type TagRelationBlocRelation = {
    isPartOf: string[],
}

export const TagRelationBloc = {
    edit: BlocHelper.wrapWithStateCallback(
        async (input: TagRelationBlocEditInput): Promise<void> => {
            Store.clear()

            await TagRelationApi.edit(input)
        },
    ),
}