import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MoviesService } from '../../../core/services/movies.service';
import { fetchingCharactersSuccess, fetchingMoviesSuccess, fetchingSingleCharacterSuccess, fetchingSingleMovieSuccess, startFetchingCharacters, startFetchingMovies, startFetchingSingleCharacter, startFetchingSingleMovie } from './movies.actions';
import { switchMap, map, withLatestFrom, of, forkJoin, startWith } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Store } from '@ngrx/store';
import { Character } from '../models/character.model';
import { selectCharacterEntities, selectMovieEntities } from './movies.selectors';

@Injectable()
export class MovieEffects {
  private moviesService = inject(MoviesService);
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadSingleMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startFetchingSingleMovie),
      withLatestFrom(
        this.store.select(selectMovieEntities),
        this.store.select(selectCharacterEntities)
      ),
      switchMap(([action, movieEntities, characterEntities]) => {
        const movieId = action.movieId;

        // Check if movie already exists in store
        const existingMovie = movieEntities[movieId];

        if (existingMovie) {
          // Movie exists → fetch only missing characters
          return this.fetchMissingCharacters(existingMovie, characterEntities);
        }

        // Movie not in store → fetch movie first
        return this.moviesService.fetchSingleMovie(movieId).pipe(
          switchMap((movie: Movie) => {
            // dispatch movie result
            const movieAction = fetchingSingleMovieSuccess({ movie });

            return this.fetchMissingCharacters(movie, characterEntities).pipe(
              startWith(movieAction)
            );
          })
        );
      })
    )
  );

    loadSingleCharacter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startFetchingSingleCharacter),
      withLatestFrom(
        this.store.select(selectMovieEntities),
        this.store.select(selectCharacterEntities)
      ),
      switchMap(([action, movieEntities, characterEntities]) => {
        const characterId = action.characterId;
        const existingCharacter = characterEntities[characterId];

        if (existingCharacter) {
          return this.fetchMissingMovies(existingCharacter, movieEntities);
        }

        return this.moviesService.fetchCharacter(characterId).pipe(
          switchMap((character: Character) => {
            const characterAction = fetchingSingleCharacterSuccess({ character })

            return this.fetchMissingMovies(character, movieEntities).pipe(
              startWith(characterAction)
            )
          })
        )
      })
    )
  )

  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startFetchingMovies),
      switchMap(() =>
        this.moviesService.fetchMovies().pipe(
          map((movies) => fetchingMoviesSuccess({ movies }))
        )
      )
    )
  );

  // First check if action.moviedId exists in movies array of store, if yes just proceed to fetch characters 
  // of that movie by movie.characterIds (that are missing in the characters array in the store). 
  // If action.movieId doesn't exist in movies array of store then send an 
  // http request to this.fetchSingleMovie(action.movieId) and for each movie.characterIds (that are missing in characters array in store)
  // to this.moviesService.fetchCharacters(movie.characterId) then dispath fetchingMovieSuccess and fetchCharactersSuccess actions.

  fetchMissingCharacters(movie: Movie, 
    characterEntities: { [id: number]: Character | undefined }) {
    const missingIds = movie.characterIds.filter(id => !characterEntities[id]);

    if (missingIds?.length === 0) {
      return of(fetchingCharactersSuccess({ characters: [] }));
    }

    return forkJoin(
      missingIds.map(id => this.moviesService.fetchCharacter(id))
    ).pipe(
      map(apiCharacters => fetchingCharactersSuccess({ characters: apiCharacters })
      )
    );
  }

  fetchMissingMovies(character: Character, movieEntities: { [id: number]: Movie | undefined }) {
    const missingIds = character.filmIds.filter(id => !movieEntities[id]);

    if (missingIds.length === 0) {
      return of(fetchingMoviesSuccess({ movies: [] }));
    };

    return forkJoin(
      missingIds.map(id => this.moviesService.fetchSingleMovie(id))).pipe(
        map((fetchedMovies: any[]) => fetchingMoviesSuccess({ movies: fetchedMovies })
        )
      )
  }
}