import axios from 'axios';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useQuery } from '@tanstack/react-query';
import { provider, useInstance } from 'react-ioc';
import { GetMoviesResponseJTO } from '@/app/_common/api-types';
import { MoviesListStore } from '@/app/movies/_components/movies-list/movies-list.store';

export const MoviesList = provider(MoviesListStore)(
  observer(() => {
    const { searchQuery, setSearchQuery } = useInstance(MoviesListStore);

    const movies = useQuery<GetMoviesResponseJTO>({
      queryKey: ['movies'],
      queryFn: ({ signal }) => {
        return axios.get('/api/movies', { signal }).then((r) => r.data);
      },
    });

    const filteredMovies = useMemo(() => {
      return movies.data?.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [movies.data, searchQuery]);

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
