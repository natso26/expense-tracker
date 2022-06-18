import {State, StateConstructor} from "../common/state";

export const BlocHelper = {
    wrapWithSetState: <I, O>(
        operation: (input: I) => Promise<O>,
    ) => async (input: I, setState: (state: State<O>) => void) => {
        setState(StateConstructor.LoadingState())

        try {
            const output = await operation(input)

            setState(StateConstructor.DataState(output))

        } catch (e) {
            setState(StateConstructor.ErrorState(e))
        }
    },
}