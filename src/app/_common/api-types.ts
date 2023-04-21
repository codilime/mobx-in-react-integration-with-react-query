type MovieJTO = { id: string; title: string; votes: number };
export type GetMoviesResponseJTO = Array<MovieJTO>;
export type MovieDetailsJTO = MovieJTO & {
  releaseYear: number;
  director: string;
};
export type GetMovieDetailsResponseJTO = MovieDetailsJTO;
