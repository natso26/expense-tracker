import {State, StateConstructor} from "../../../common/state";
import React from "react";
import {UseState} from "../type";

export const useWrappedState = <T>() => (
    React.useState<State<T>>(StateConstructor.Init())
)

export const useNavigateBack = (navigate: (delta: number) => void) => (
    React.useCallback(() => {
        navigate(-1)
    }, [navigate])
)

export const useStateFromCallback = <T>(
    initialState: T,
    callback: (state: T) => void
): UseState<T> => {
    const ref = React.useRef(initialState)

    return [
        ref.current,
        React.useCallback((action) =>
            // eslint-disable-next-line react-hooks/exhaustive-deps
            callback(ref.current = action instanceof Function ? action(ref.current) : action), []),
    ]
}