import { createFeatureSelector, createSelector } from "@ngrx/store";
import { characterAdapter, CharactersState, movieAdapter, MoviesState } from "./movies.reducers";

export const selectMoviesState = createFeatureSelector<MoviesState>('movies');

export const {
  selectAll: selectAllMovies,
  selectEntities: selectMovieEntities,
  selectIds: selectMovieIds,
} = movieAdapter.getSelectors(selectMoviesState);

export const selectMovieById = (id: number) =>
  createSelector(selectMovieEntities, (entities) => entities[id]);


export const selectCharactersState = createFeatureSelector<CharactersState>('characters');

export const {
  selectAll: selectAllCharacters,
  selectEntities: selectCharacterEntities,
} = characterAdapter.getSelectors(selectCharactersState);

export const selectCharactersByIds = (ids: number[]) =>
  createSelector(selectAllCharacters, (characters) =>
    characters.filter((c) => ids.includes(c.id))
);

export const selectCharacterById = (id: number) =>
  createSelector(selectCharacterEntities, entities => entities[id]);

export const selectMoviesLoading =
  createSelector(selectMoviesState, state => state.fetchingMovies);

export const selectCharactersLoading =
  createSelector(selectCharactersState, state => state.fetchingCharacters);

export const selectAnyLoading = createSelector(
  selectMoviesLoading,
  selectCharactersLoading,
  (loadingMovies, loadingCharacters) =>
    loadingMovies || loadingCharacters
);

