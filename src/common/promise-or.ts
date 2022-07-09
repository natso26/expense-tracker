export type PromiseOr<T> = Promise<T> | T

export const wrapFuncWithPromiseOr = <I, O>(
    func: (input: I) => PromiseOr<O>,
): (input: PromiseOr<I>) => PromiseOr<O> =>
    (input) => input instanceof Promise ? input.then(func) : func(input)