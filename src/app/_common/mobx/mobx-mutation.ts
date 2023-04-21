import { inject } from 'react-ioc';
import { observable, runInAction } from 'mobx';
import {
  MutationObserver,
  MutationObserverOptions,
  MutationObserverResult,
  QueryClient,
} from '@tanstack/react-query';

export class MobxMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> {
  readonly #queryClient = inject(this, QueryClient);
  readonly #reactMutationResult = observable(
    {},
    { deep: false },
  ) as MutationObserverResult<TData, TError>;
  #observer?: MutationObserver<TData, TError, TVariables, TContext>;
  #unsubscribe?: () => void;

  constructor(
    private defaultOptions: MutationObserverOptions<
      TData,
      TError,
      TVariables,
      TContext
    >,
  ) {}

  get data() {
    return this.#reactMutationResult.data;
  }

  get error() {
    return this.#reactMutationResult.error ?? null;
  }

  get isError() {
    return this.#reactMutationResult.isError ?? false;
  }

  get isIdle() {
    return this.#reactMutationResult.isIdle ?? true;
  }

  get isLoading() {
    return this.#reactMutationResult.isLoading ?? false;
  }

  get isSuccess() {
    return this.#reactMutationResult.isSuccess ?? false;
  }

  get status() {
    return this.#reactMutationResult.status ?? 'idle';
  }

  mutate(
    variables: TVariables,
    options?: MutationObserverOptions<TData, TError, TVariables, TContext>,
  ): MutationObserverResult<TData, TError> {
    this.mutateAsync(variables, options).catch(noop);
    return this.#reactMutationResult;
  }

  async mutateAsync(
    variables: TVariables,
    options?: MutationObserverOptions<TData, TError, TVariables, TContext>,
  ): Promise<MutationObserverResult<TData, TError>> {
    if (this.#unsubscribe) {
      this.#unsubscribe?.();
    }

    this.#observer = new MutationObserver(
      this.#queryClient,
      this.defaultOptions,
    );
    this.#unsubscribe = this.#observer.subscribe((result) =>
      runInAction(() => Object.assign(this.#reactMutationResult, result)),
    );

    try {
      await this.#observer.mutate(variables, options);
    } catch (e) {
      // error will be handled in the store/ui
    }
    return this.#reactMutationResult;
  }

  dispose() {
    this.#unsubscribe?.();
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
