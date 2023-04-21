import axios from 'axios';
import { inject } from 'react-ioc';
import { observable, runInAction } from 'mobx';
import { QueryClient, QueryObserver } from '@tanstack/react-query';

export class MoviesStore {
  #queryClient = inject(this, QueryClient);
  #moviesQueryResult = observable({}, { deep: false });

  get movies() {
    if (!this.subscription) {
      const observer = new QueryObserver(this.#queryClient, {
        queryKey: ['movies'],
        queryFn: () => axios.get('/api/movies').then((r) => r.data),
      });
      runInAction(() =>
        Object.assign(this.#moviesQueryResult, observer.getCurrentResult()),
      );
      this.subscription = observer.subscribe((result) => {
        runInAction(() => Object.assign(this.#moviesQueryResult, result));
      });
    }
    return this.#moviesQueryResult;
  }
}
