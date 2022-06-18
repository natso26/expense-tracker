import {CombinedCache} from "./combined-cache";
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
    edit: BlocHelper.wrapWithSetState(
        async (input: TagRelationBlocEditInput): Promise<void> => {
            CombinedCache.clear()

            await TagRelationApi.edit(input)
        },
    ),
}