import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import {
  fetchingMoviesSuccess,
  fetchingSingleMovieSuccess,
  fetchingCharactersSuccess,
  startFetchingMovies,
  startFetchingSingleMovie,
  startFetchingSingleCharacter,
  fetchingSingleCharacterSuccess
} from './movies.actions';
import { Movie } from '../models/movie.model';
import { Character } from '../models/character.model';

export interface MoviesState extends EntityState<Movie> {
  fetchingMovies: boolean;
}

export interface CharactersState extends EntityState<Character> {
  fetchingCharacters: boolean;
}

export interface AppState {
  movies: MoviesState;
  characters: CharactersState;
}

export const movieAdapter = createEntityAdapter<Movie>();
export const characterAdapter = createEntityAdapter<Character>();

export const initialMoviesState: MoviesState = movieAdapter.getInitialState({
  fetchingMovies: false
});

export const initialCharactersState: CharactersState = characterAdapter.getInitialState({
  fetchingCharacters: false
});

export const movieReducer = createReducer(
  initialMoviesState,

  on(startFetchingMovies, state => ({
    ...state,
    fetchingMovies: false
  })),

  on(fetchingMoviesSuccess, (state, { movies }) =>
    movieAdapter.addMany(movies, { ...state, fetchingMovies: false })
  ),

  on(fetchingSingleMovieSuccess, (state, { movie }) =>
    movieAdapter.upsertOne(movie, { ...state, fetchingMovies: false })
  )
);

export const characterReducer = createReducer(
  initialCharactersState,

  on(startFetchingSingleMovie, state => ({
    ...state,
    fetchingCharacters: false
  })),

    on(startFetchingSingleCharacter, (state) => ({
    ...state,
    fetchingCharacters: false
  })),

  // Single fetch success → UP SERT to avoid duplicates
  on(fetchingSingleCharacterSuccess, (state, { character }) =>
    characterAdapter.upsertOne(character, {
      ...state,
      fetchingCharacters: false
    })
  ),

    on(fetchingCharactersSuccess, (state, { characters }) =>
    characterAdapter.upsertMany(characters, {
      ...state,
      fetchingCharacters: false
    })
  )
);

export const reducers: ActionReducerMap<AppState> = {
  movies: movieReducer,
  characters: characterReducer
};