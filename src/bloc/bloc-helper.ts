import {State, StateConstructor} from "../common/state";

export const BlocHelper = {
    wrapWithStateCallback: <I, O>(
        operation: (input: I) => Promise<O>,
    ) => async (input: I, stateCallback: (state: State<O>) => void) => {
        stateCallback(StateConstructor.LoadingState())

        try {
            const output = await operation(input)

            stateCallback(StateConstructor.DataState(output))

        } catch (e) {
            stateCallback(StateConstructor.ErrorState(e))
        }
    },
}