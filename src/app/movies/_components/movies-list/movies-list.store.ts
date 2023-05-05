import { makeAutoObservable } from 'mobx';
import { MobxQuery } from '@/app/_common/mobx/mobx-query';
import axios from 'axios';
import { GetMoviesResponseJTO } from '@/app/_common/api-types';

export class MoviesListStore {
  #moviesQueryResult = new MobxQuery<GetMoviesResponseJTO>({
    queryKey: ['movies'],
    queryFn: () => axios.get('/api/movies').then((r) => r.data),
  });

  private readonly state = {
    searchQuery: '',
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get movies() {
    return this.#moviesQueryResult.query();
  }

  get searchQuery() {
    return this.state.searchQuery;
  }

  get filteredMovies() {
    return this.movies.data?.filter((movie) =>
      movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
  }

  setSearchQuery(searchQuery: MoviesListStore['searchQuery']) {
    this.state.searchQuery = searchQuery;
  }

  dispose() {
    this.#moviesQueryResult.dispose();
  }
}
