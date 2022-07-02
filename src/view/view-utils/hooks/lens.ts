import React, {Dispatch, SetStateAction} from "react";

export type Lens<S, T> = {
    view: (state: S) => T,
    set: (state: S, value: T) => S,
}
export const useLens = <S, T>(
    useState: [S, Dispatch<SetStateAction<S>>],
    lens: Lens<S, T>,
): [T, Dispatch<SetStateAction<T>>] => {
    const [state, setState] = useState

    return [
        lens.view(state),
        React.useCallback((action) => {
            setState((state) =>
                lens.set(state, action instanceof Function ? action(lens.view(state)) : action))
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    ]
}