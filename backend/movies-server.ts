import f, { FastifyRequest } from 'fastify';
import { pick } from 'lodash';
import { moviesData } from './movies-data';

const server = f({
  logger: true,
  rewriteUrl: (req) => {
    return req.url?.replace(/^\/api/, '') || '';
  },
});

const wait = (timeout = 500) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const state = moviesData();

server.get('/movies', async () => {
  await wait();
  return state.map((movie) => pick(movie, ['id', 'title']));
});

server.get(
  '/movies/:id/details',
  async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    await wait();
    const movie = state.find((movie) => movie.id === request.params.id);
    if (movie) {
      return movie;
    } else {
      reply.status(404);
    }
  },
);

server.post(
  '/movies/:id/fav',
  async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    await wait();
    const movie = state.find((movie) => movie.id === request.params.id);
    if (movie) {
      movie.votes++;
      reply.status(200);
    } else {
      reply.status(404);
    }
  },
);

const start = async () => {
  try {
    await server.listen({ port: 7777 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
