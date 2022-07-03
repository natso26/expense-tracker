import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import React from "react";
import {EditTagRuleForm} from "./components/EditTagRuleForm";
import {parseTagRule} from "../../common/tag-rule";
import {useNavigateBack} from "../view-utils/hooks/helper";
import {VerticalMargin} from "../components/vertical-margin";

export const EditTagRulePage = () => {
    const {tag} = useParams()
    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    const onFormSubmitCallback = useNavigateBack(navigate)

    return <>
        <h1>Edit Tag Rule</h1>
        <VerticalMargin>
            <Link to={-1 as any}>Back</Link>
        </VerticalMargin>
        <EditTagRuleForm data={{
            tag: tag!,
            rule: parseTagRule({
                isPartOf: searchParams.get('isPartOf') ?? '',
            }),
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}