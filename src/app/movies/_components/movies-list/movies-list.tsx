import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { provider, useInstance } from 'react-ioc';
import { MoviesListStore } from '@/app/movies/_components/movies-list/movies-list.store';

export const MoviesList = provider(MoviesListStore)(
  observer(() => {
    const { searchQuery, setSearchQuery, movies, filteredMovies } =
      useInstance(MoviesListStore);

    if (movies.isLoading) return <>Loading...</>;
    if (movies.isError) return <>Error occurred :(</>;
    return (
      <>
        <p>
          <Link to="/">&laquo; Home</Link>
        </p>
        <form>
          <label>
            Search{' '}
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </form>
        <ul>
          {filteredMovies?.map((movie) => (
            <li key={movie.id}>
              <Link to={`/movies/${movie.id}/details`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      </>
    );
  }),
);
