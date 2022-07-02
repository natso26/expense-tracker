import {State, StateConstructor} from "../../../common/state";
import React, {DependencyList, EffectCallback} from "react";

export const useWrappedState = <T>() => (
    React.useState<State<T>>(StateConstructor.Init())
)

export const useNavigateBack = (navigate: (delta: number) => void) => (
    React.useCallback(() => {
        navigate(-1)
    }, [navigate])
)

export const useEffectSkipInitial = (effect: EffectCallback, deps?: DependencyList) => {
    const runEffect = React.useRef(false)

    React.useEffect(() => {
        if (!runEffect.current) {
            runEffect.current = true
            return
        }

        effect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}