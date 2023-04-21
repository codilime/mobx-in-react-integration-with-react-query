import {
  DefaultedQueryObserverOptions,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import { inject } from 'react-ioc';
import { observable, runInAction } from 'mobx';

export class MobxQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  readonly #queryClient = inject(this, QueryClient);
  readonly #defaultOptions: DefaultedQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;
  #observer?: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  #reactQueryResult = observable({}, { deep: false }) as QueryObserverResult<
    TData,
    TError
  >;
  #subscription?: () => void;

  constructor(
    options: QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    > = {},
  ) {
    const { _defaulted, ...defaultOptions } =
      this.#queryClient.defaultQueryOptions(options);
    this.#defaultOptions = defaultOptions;
  }

  query(
    options?: QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >,
  ): QueryObserverResult<TData, TError> {
    const opts = Object.assign({}, this.#defaultOptions, options);
    if (this.#observer) {
      this.#observer.setOptions(opts);
    } else {
      const observer = (this.#observer = new QueryObserver(
        this.#queryClient,
        opts,
      ));
      runInAction(() =>
        Object.assign(this.#reactQueryResult, observer.getCurrentResult()),
      );
      this.#subscription = observer.subscribe((result) =>
        runInAction(() => Object.assign(this.#reactQueryResult, result)),
      );
    }
    return this.#reactQueryResult;
  }

  dispose() {
    this.#subscription?.();
  }
}
