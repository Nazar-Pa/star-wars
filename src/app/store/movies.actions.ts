import { createAction, props } from '@ngrx/store';
import { Movie } from '../movie.model';
import { Character } from '../character.model';

export const startFetchingMovies = createAction(
  '[Movies] Start Fetching Movies'
);

export const fetchingMoviesSuccess = createAction(
  '[Movies] Fetching Movies Success',
  props<{ movies: Movie[] }>()
);

export const startFetchingSingleMovie = createAction(
  '[Movie] Start Fetching Single Movie',
  props<{ movieId: number }>()
);

export const fetchingSingleMovieSuccess = createAction(
  '[Movie] Fetching Single Movie Success',
  props<{ movie: Movie }>()
)

export const startFetchingCharacters = createAction(
  '[Characters] Start Fetching Characters'
);

export const fetchingCharactersSuccess = createAction(
  '[Characters] Fetching Characters Success',
  props<{ characters: Character[] }>()
)

export const startFetchingSingleCharacter = createAction(
  '[Characters] Start Fetching Single Character',
  props<{ characterId: number }>()
)

export const fetchingSingleCharacterSuccess = createAction(
  '[Characters] Fetching Single Character Success',
  props<{ character: Character }>()
)