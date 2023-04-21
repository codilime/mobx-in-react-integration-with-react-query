import { inject } from 'react-ioc';
import { observable, runInAction } from 'mobx';
import { MutationObserver, QueryClient } from '@tanstack/react-query';

export class MobxMutationJs {
  #queryClient = inject(this, QueryClient);
  #reactMutationResult = observable({}, { deep: false });
  #unsubscribe;

  constructor(defaultOptions) {
    this.defaultOptions = defaultOptions;
  }

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

  mutate(variables, options) {
    this.mutateAsync(variables, options).catch(noop);
    return this.#reactMutationResult;
  }

  async mutateAsync(variables, options) {
    if (this.#unsubscribe) {
      this.#unsubscribe?.();
    }

    const observer = new MutationObserver(
      this.#queryClient,
      this.defaultOptions,
    );
    this.#unsubscribe = observer.subscribe((result) =>
      runInAction(() => Object.assign(this.#reactMutationResult, result)),
    );

    try {
      await observer.mutate(variables, options);
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
