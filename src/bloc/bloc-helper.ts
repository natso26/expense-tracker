import {State, StateConstructor} from "../common/state";
import {PromiseOr} from "../common/promise-or";

export const BlocHelper = {
    wrapWithStateCallback: <I, O>(
        operation: (input: I) => PromiseOr<O>,
    ) => (input: I, stateCallback: (state: State<O>) => void) => {
        try {
            const output = operation(input)

            if (!(output instanceof Promise)) {
                stateCallback(StateConstructor.Data(output))

            } else {
                stateCallback(StateConstructor.Loading())

                output
                    .then((output) =>
                        stateCallback(StateConstructor.Data(output)))
                    .catch((e) =>
                        stateCallback(StateConstructor.Error(e)))
            }

        } catch (e) {
            stateCallback(StateConstructor.Error(e))
        }
    },
}