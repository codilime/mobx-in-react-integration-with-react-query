import { MobxQuery } from '@/app/_common/mobx/mobx-query';
import { GetMovieDetailsResponseJTO } from '@/app/_common/api-types';
import axios from 'axios';
import { MobxMutation } from '@/app/_common/mobx/mobx-mutation';
import { inject } from 'react-ioc';
import { QueryClient } from '@tanstack/react-query';

export class MovieDetailsStore {
  #queryClient = inject(this, QueryClient);
  #movieDetailsQueryResult = new MobxQuery<GetMovieDetailsResponseJTO>({
    queryFn: ({ queryKey }) => {
      return axios
        .get(`/api/movies/${queryKey[1]}/details`)
        .then((r) => r.data);
    },
  });

  incrementFavsMutation = new MobxMutation<
    unknown,
    unknown,
    { movieId: string }
  >({
    mutationFn: async (variables) => {
      await axios.post(`/api/movies/${variables.movieId}/fav`);
    },
    onSuccess: (data, variables) => {
      this.#queryClient.invalidateQueries(['movie', variables.movieId]);
    },
  });

  getMovie(movieId: string) {
    return this.#movieDetailsQueryResult.query({
      queryKey: ['movie', movieId],
    });
  }

  dispose() {
    this.#movieDetailsQueryResult.dispose();
    this.incrementFavsMutation.dispose();
  }
}
