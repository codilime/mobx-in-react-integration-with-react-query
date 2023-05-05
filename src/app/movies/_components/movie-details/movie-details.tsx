import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { provider, useInstance } from 'react-ioc';
import { MovieDetailsStore } from '@/app/movies/_components/movie-details/movie-details.store';

export const MovieDetails = provider(MovieDetailsStore)(
  observer(() => {
    const store = useInstance(MovieDetailsStore);
    const { movieId } = useParams();

    if (!movieId) {
      return <>Invalid path!</>;
    }

    const movie = store.getMovie(movieId);

    if (movie.isLoading) return <>Loading...</>;
    if (movie.isError) return <>Error occurred :(</>;

    return (
      <section>
        <p>
          <Link to={`/movies`}>&laquo; Back to list</Link>
        </p>
        <table border={1}>
          <tbody>
            <tr>
              <th>Title</th>
              <td>{movie.data.title}</td>
            </tr>
            <tr>
              <th>Release year</th>
              <td>{movie.data.releaseYear}</td>
            </tr>
            <tr>
              <th>Director</th>
              <td>{movie.data.director}</td>
            </tr>
            <tr>
              <th>👍</th>
              <td>
                {movie.data.votes}{' '}
                <button
                  disabled={store.incrementFavsMutation.isLoading}
                  onClick={() =>
                    store.incrementFavsMutation.mutate({ movieId })
                  }
                >
                  Vote!
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <Link to={`/movies/${parseInt(movie.data.id) - 1}/details`}>
            &laquo; Prev
          </Link>{' '}
          <Link to={`/movies/${parseInt(movie.data.id) + 1}/details`}>
            Next &raquo;
          </Link>
        </p>
      </section>
    );
  }),
);
