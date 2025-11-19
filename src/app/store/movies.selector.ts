import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./movies.reducers";

export const selectAppState = createFeatureSelector<AppState>('appState');

export const selectAllMovies = createSelector(selectAppState, (state) => state.movies);