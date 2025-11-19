import { createReducer, on } from "@ngrx/store";
import { Character } from "../character.model";
import { Movie } from "../movie.model";
import { fetchingCharactersSuccess, fetchingMoviesSuccess, fetchingSingleCharacterSuccess, fetchingSingleMovieSuccess, startFetchingMovies, startFetchingSingleCharacter, startFetchingSingleMovie } from "./movies.actions";

export interface AppState {
  movies: Movie[];
  characters: Character[];
  fetchingMovies: boolean;
  fetchingCharacters: boolean;
}

export const initialAppState: AppState = {
  movies: [],
  characters: [],
  fetchingMovies: false,
  fetchingCharacters: false
};

export const movieReducer = createReducer(
  initialAppState,

  on(startFetchingMovies, (state) => ({
    ...state,
    fetchingMovies: true
  })),

  on(fetchingMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies: [...state.movies, ...movies.filter(movie => !state.movies.some(m => movie.id === m.id))],
    fetchingMovies: false
  })),

  on(startFetchingSingleMovie, (state) => ({
    ...state, 
    fetchingMovies: true,
    fetchingCharacters: true
  })),

  on(fetchingSingleMovieSuccess, (state, { movie }) => ({
    ...state,
    movies: [...state.movies, movie],
    fetchingMovies: false,
  })),

  on(fetchingCharactersSuccess, (state, { characters }) => ({
    ...state,
    characters: [...state.characters, ...characters],
    fetchingCharacters: false
  })),

    on(startFetchingSingleCharacter, (state) => ({
    ...state, 
    fetchingMovies: true,
    fetchingCharacters: true
  })),

  on(fetchingSingleCharacterSuccess, (state, { character }) => ({
    ...state,
    characters: [...state.characters, character],
    fetchingCharacters: true,
  })),
);