import {State, StateConstructor} from "../../common/state";
import React, {DependencyList, Dispatch, EffectCallback, SetStateAction} from "react";

export const useWrappedState = <T>() => (
    React.useState<State<T>>(StateConstructor.Init())
)

export const useNavigateBack = (navigate: (delta: number) => void) => (
    React.useCallback(() => {
        navigate(-1)
    }, [navigate])
)

export type Lens<S, T> = {
    view: (state: S) => T,
    set: (state: S, value: T) => S,
}

export const useEffectIfNotInitial = (effect: EffectCallback, deps?: DependencyList) => {
    const notInitial = React.useRef(false)

    React.useEffect(() => {
        if (!notInitial.current) {
            notInitial.current = true
            return
        }

        effect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
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