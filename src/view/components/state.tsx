import React from "react";
import styled from "styled-components";

export const StateComponent = {
    Loading: () => (
        <Styled.Loading>
            <p>Loading...</p>
        </Styled.Loading>
    ),
    Success: () => (
        <Styled.Success>
            <p>Success</p>
        </Styled.Success>
    ),
    Error: (props: {
        data: {
            error: any,
        },
    }) => (
        <Styled.Error>
            <p>Error:</p>
            <p>{props.data.error.message ?? 'Unknown error'}</p>
        </Styled.Error>
    ),
}

const Styled = {
    Loading: styled.div`
      color: blue;
    `,
    Success: styled.div`
      color: green;
    `,
    Error: styled.div`
      color: red;
    `,
}