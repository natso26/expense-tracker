import React from "react";
import {createSearchParams, Link, useSearchParams} from "react-router-dom";
import {Dashboard, DashboardDataQuery} from "./components/Dashboard";
import {compactSerializeTags, parseTags} from "../../common/tag";
import {parseDateTime} from "../../common/date";
import {VerticalMargin} from "../components/vertical-margin";
import {useStateFromCallback} from "../view-utils/hooks/helper";

export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [query, setQuery] = useStateFromCallback(parseQuery(searchParams), (query: DashboardDataQuery) =>
        setSearchParams(serializeQuery(query), {replace: true}))

    const hasRewrittenQuery = React.useRef<boolean>(false)

    React.useEffect(() => {
        hasRewrittenQuery.current = true

        setQuery(query)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>
        <h1>Expense Tracker</h1>
        <VerticalMargin>
            <Link to='/new-expense'>New expense</Link>
        </VerticalMargin>
        {hasRewrittenQuery.current &&
            <Dashboard data={{
                query: [query, setQuery],
            }}/>
        }
    </>
}

const parseQuery = (params: URLSearchParams): DashboardDataQuery => ({
    view: params.get('view') === 'tags' ? 'tags' : 'expenses',
    filter: {
        date: parseDateTime(params.get('date') ?? '') || undefined,
        title: params.get('title') ?? '',
        tags: parseTags(params.get('tags') ?? ''),
    },
    tagSearch: {
        name: params.get('tagName') ?? '',
        isPartOf: parseTags(params.get('tagIsPartOf') ?? ''),
    },
})

const serializeQuery = (query: DashboardDataQuery): URLSearchParams => {
    const {
        view,
        filter: {date, title, tags,},
        tagSearch: {name, isPartOf},
    } = query

    return createSearchParams(Object.fromEntries(Object.entries({
        view: view === 'expenses' ? '' : view,
        date: date?.toISOString() ?? '',
        title,
        tags: compactSerializeTags(tags),
        tagName: name,
        tagIsPartOf: compactSerializeTags(isPartOf),
    }).filter(
        ([, v]) => v,
    )))
}