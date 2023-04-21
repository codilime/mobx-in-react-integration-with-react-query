import { makeAutoObservable } from 'mobx';

export class MoviesListStore {
  private readonly state = {
    searchQuery: '',
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get searchQuery() {
    return this.state.searchQuery;
  }

  setSearchQuery(searchQuery: MoviesListStore['searchQuery']) {
    this.state.searchQuery = searchQuery;
  }
}
