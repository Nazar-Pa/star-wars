import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './movies.reducers';

import {
  startFetchingMovies,
  startFetchingSingleCharacter,
  startFetchingSingleMovie
} from './movies.actions';

import {
  selectAllMovies,
  selectMovieById,
  selectCharactersByIds,
  selectMoviesLoading,
  selectCharactersLoading,
  selectAnyLoading,
  selectCharacterById
} from './movies.selectors';

import { Observable, switchMap, map, of } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class MoviesFacade {

  private store = inject(Store<AppState>);
  allMovies$ = this.store.select(selectAllMovies);
  moviesLoading$ = this.store.select(selectMoviesLoading);
  charactersLoading$ = this.store.select(selectCharactersLoading);
  anyLoading$ = this.store.select(selectAnyLoading);

  loadMovies(): void {
    this.store.dispatch(startFetchingMovies());
  }

  loadMovie(id: number): void {
    this.store.dispatch(startFetchingSingleMovie({ movieId: id }));
  }

  movie$(id: number): Observable<Movie | undefined> {
    return this.store.select(selectMovieById(id));
  }

  character$(id: number) {
    return this.store.select(selectCharacterById(id));
  }

  loadCharacter(id: number) {
    this.store.dispatch(startFetchingSingleCharacter({ characterId: id }));
  }

  charactersForMovie$(movieId: number): Observable<Character[]> {
    return this.store.select(selectMovieById(movieId)).pipe(
      switchMap(movie =>
        movie
          ? this.store.select(selectCharactersByIds(movie.characterIds))
          : of([])
      )
    );
  }


  movieWithCharacters$(movieId: number): Observable<{ movie: Movie | undefined, characters: Character[] }> {
    return this.movie$(movieId).pipe(
      switchMap(movie =>
        movie
          ? this.charactersForMovie$(movieId).pipe(
              map(chars => ({
                movie,
                characters: chars
              }))
            )
          : of({ movie: undefined, characters: [] })
      )
    );
  }
}
