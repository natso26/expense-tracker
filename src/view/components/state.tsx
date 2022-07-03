import React from "react";
import styled from "styled-components";

export const StateComponent = {
    Loading: () => (
        <Styled.LoadingDiv>
            <p>Loading...</p>
        </Styled.LoadingDiv>
    ),
    Success: () => (
        <Styled.SuccessDiv>
            <p>Success</p>
        </Styled.SuccessDiv>
    ),
    Error: (props: {
        data: {
            error: any,
        },
    }) => (
        <Styled.ErrorDiv>
            <p>Error:</p>
            <p>{props.data.error.message ?? 'Unknown error'}</p>
        </Styled.ErrorDiv>
    ),
}

const Styled = {
    LoadingDiv: styled.div`
      color: blue;
    `,
    SuccessDiv: styled.div`
      color: green;
    `,
    ErrorDiv: styled.div`
      color: red;
    `,
}