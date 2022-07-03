import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import classes from "./EditTagRulePage.module.css";
import React from "react";
import {EditTagRuleForm} from "./form/EditTagRuleForm";
import {parseTagRule} from "../../common/tag-rule";
import {useNavigateBack} from "../view-utils/hooks/helper";


export const EditTagRulePage = () => {
    const {tag} = useParams()
    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    const onFormSubmitCallback = useNavigateBack(navigate)

    return <>
        <h1>Edit Tag Rule</h1>
        <div className={classes['vertical-space']}>
            <Link to={-1 as any}>Back</Link>
        </div>
        <EditTagRuleForm data={{
            tag: tag!,
            rule: parseTagRule({
                isPartOf: searchParams.get('isPartOf') ?? '',
            }),
            onSubmitCallback: onFormSubmitCallback,
        }}/>
    </>
}