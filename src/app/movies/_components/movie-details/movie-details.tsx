import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const MovieDetails = observer(() => {
  const { movieId } = useParams();
  const queryClient = useQueryClient();

  const movie = useQuery({
    queryKey: ['movie', movieId],
    queryFn: ({ queryKey }) => {
      return axios
        .get(`/api/movies/${queryKey[1]}/details`)
        .then((r) => r.data);
    },
  });

  const incrementFavsMutation = useMutation<
    unknown,
    unknown,
    { movieId: string }
  >({
    mutationFn: async (variables) => {
      await axios.post(`/api/movies/${variables.movieId}/fav`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['movie', variables.movieId]);
    },
  });

  if (!movieId) {
    return <>Invalid path!</>;
  }

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
                disabled={incrementFavsMutation.isLoading}
                onClick={() => incrementFavsMutation.mutate({ movieId })}
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
});
