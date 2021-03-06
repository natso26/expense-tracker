import React, {ChangeEvent} from "react";
import {parseTags, serializeTags} from "../../../../common/tag";
import {UseState} from "../../../view-utils/type";
import {tagsInputPlaceholder} from "../../../view-utils/const";
import {TagSummaryTable} from "./TagSummaryTable";
import {InputGrid} from "../../../components/input-grid";
import {VerticalMargin} from "../../../components/vertical-margin";

export const TagSummaryView = (props: {
    data: {
        tagSearch: UseState<TagSearch>,
        tagSummaries: (tagSearch: TagSearch) => Parameters<typeof TagSummaryTable>[0]['data']['tagSummaries'],
    },
}) => {
    const {
        tagSearch: [tagSearch, setTagSearch],
        tagSummaries: tagSummariesSearcher,
    } = props.data

    const {name, isPartOf} = tagSearch

    const [{
        name: initialName,
        isPartOf: initialIsPartOf,
    }] = React.useState<TagSearch>(tagSearch)

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

    const tagSummaries = tagSummariesSearcher(tagSearch)

    const showClearTagSearch = Boolean(name || isPartOf.length)

    return <>
        <InputGrid>
            <label htmlFor="name">Name</label>
            <input
                onChange={onNameChange}
                id="name"
                type="search"
                defaultValue={initialName}
            />
            <label htmlFor="isPartOf">Is part of</label>
            <input
                onChange={onIsPartOfChange}
                id="isPartOf"
                type="search"
                placeholder={tagsInputPlaceholder}
                defaultValue={serializeTags(initialIsPartOf)}
            />
        </InputGrid>
        {showClearTagSearch && (
            <VerticalMargin>
                <button onClick={onClickClearTagSearch}>Clear search</button>
            </VerticalMargin>
        )}
        <TagSummaryTable data={{
            tagSummaries,
        }}/>
    </>
}

type TagSearch = {
    name: string,
    isPartOf: string[],
}