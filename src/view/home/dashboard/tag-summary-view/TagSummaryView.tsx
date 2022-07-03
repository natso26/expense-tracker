import React, {ChangeEvent} from "react";
import {parseTags, serializeTags} from "../../../../common/tag";
import classes from "./TagSummaryView.module.css";
import {GetSet} from "../../../view-utils/type";
import {useEffectSkipInitial} from "../../../view-utils/hooks/helper";
import {tagsInputPlaceholder} from "../../../view-utils/const";
import {TagSummaryTable} from "./TagSummaryTable";

export type TagSummaryViewData = {
    tagSummaries: (tagSearch: TagSummaryViewDataSearch) => Map<string, TagSummaryViewDataSummary>,
    tagSearch: GetSet<TagSummaryViewDataSearch>,
}

export type TagSummaryViewDataSummary = {
    amount?: number,
    isPartOf: string[],
}

export type TagSummaryViewDataSearch = {
    name: string,
    isPartOf: string[],
}

export const TagSummaryView = (props: {
    data: TagSummaryViewData,
}) => {
    type TagSearch = {
        name: string,
        isPartOf: string[],
    }

    const {
        tagSummaries: tagSummarySearcher,
        tagSearch: {get: getTagSearch, set: setTagSearchCallback},
    } = props.data

    const [tagSearch, setTagSearch] = React.useState<TagSearch>(getTagSearch())

    const [initialTagSearch] = React.useState<TagSearch>(tagSearch)

    useEffectSkipInitial(() => {
        setTagSearchCallback(tagSearch)
    }, [setTagSearchCallback, tagSearch])

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagSearch((tagSearch) => ({
            ...tagSearch,
            name: e.target.value.trim().toLowerCase(),
        }))
    }

    const onIsPartOfChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagSearch((tagSearch) => ({
            ...tagSearch,
            isPartOf: parseTags(e.target.value),
        }))
    }

    const onClickClearTagSearch = () => {
        setTagSearch(() => {
            document.querySelector<HTMLInputElement>('#name')!.value = ''
            document.querySelector<HTMLInputElement>('#isPartOf')!.value = ''

            return {
                name: '',
                isPartOf: [],
            }
        })
    }

    const isTagSearchNonEmpty = Boolean(tagSearch.name || tagSearch.isPartOf.length)

    const tagSummaries = tagSummarySearcher(tagSearch)

    return <>
        <div className={classes['input-grid']}>
            <label htmlFor="name">Name</label>
            <input
                onChange={onNameChange}
                id="name"
                type="search"
                defaultValue={initialTagSearch.name}
            />
            <label htmlFor="isPartOf">Is part of</label>
            <input
                onChange={onIsPartOfChange}
                id="isPartOf"
                type="search"
                placeholder={tagsInputPlaceholder}
                defaultValue={serializeTags(initialTagSearch.isPartOf)}
            />
        </div>
        {isTagSearchNonEmpty && (
            <div className={classes['vertical-space']}>
                <button onClick={onClickClearTagSearch}>Clear tag search</button>
            </div>
        )}
        <TagSummaryTable data={{
            tagSummaries,
        }}/>
    </>
}