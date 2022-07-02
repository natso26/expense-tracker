import React from "react";

export type ErrorStateComponentData = {
    error: any,
}

export const StateComponent = {
    Loading: () => (
        <p>Loading...</p>
    ),
    Success: () => (
        <p>Success</p>
    ),
    Error: (props: {
        data: ErrorStateComponentData,
    }) => <>
        <p>Error:</p>
        <p>{props.data.error.message ?? 'Unknown error'}</p>
    </>,
}