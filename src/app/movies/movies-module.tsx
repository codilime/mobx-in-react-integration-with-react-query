import { Route, Routes } from 'react-router-dom';
import { MoviesList } from '@/app/movies/_components/movies-list/movies-list';
import { MovieDetails } from '@/app/movies/_components/movie-details/movie-details';

const MoviesModule = () => {
  return (
    <Routes>
      <Route path="" element={<MoviesList />} />
      <Route path=":movieId/details" element={<MovieDetails />} />
    </Routes>
  );
};

export default MoviesModule;
