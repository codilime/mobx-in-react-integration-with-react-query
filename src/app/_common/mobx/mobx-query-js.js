import { inject } from 'react-ioc';
import { observable, runInAction } from 'mobx';
import { QueryClient, QueryObserver } from '@tanstack/react-query';

export class MobxQueryJs {
  #queryClient = inject(this, QueryClient);
  #reactQueryResult = observable({}, { deep: false });

  constructor(options = {}) {
    const { _defaulted, ...defaultOptions } =
      this.#queryClient.defaultQueryOptions(options);
    this.defaultOptions = defaultOptions;
  }

  query(options) {
    const opts = Object.assign({}, this.defaultOptions, options);
    if (this.observer) {
      this.observer.setOptions(opts);
    } else {
      const observer = (this.observer = new QueryObserver(
        this.#queryClient,
        opts,
      ));
      runInAction(() =>
        Object.assign(this.#reactQueryResult, observer.getCurrentResult()),
      );
      this.subscription = observer.subscribe((result) =>
        runInAction(() => Object.assign(this.#reactQueryResult, result)),
      );
    }
    return this.#reactQueryResult;
  }

  dispose() {
    this.subscription?.();
    delete this.observer;
  }
}
