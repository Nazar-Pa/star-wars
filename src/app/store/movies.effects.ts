import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MoviesService } from '../movies.service';
import { fetchingCharactersSuccess, fetchingMoviesSuccess, fetchingSingleCharacterSuccess, fetchingSingleMovieSuccess, startFetchingCharacters, startFetchingMovies, startFetchingSingleCharacter, startFetchingSingleMovie } from './movies.actions';
import { switchMap, map, debounceTime, withLatestFrom, filter, of, forkJoin, startWith, EMPTY } from 'rxjs';
import { Movie } from '../movie.model';
import { Store } from '@ngrx/store';
import { Character } from '../character.model';

@Injectable()
export class MovieEffects {
  private moviesService = inject(MoviesService);
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadMovies$ = createEffect(() => 
    this.actions$.pipe(
      ofType(startFetchingMovies),
      withLatestFrom(this.store.select(state => state.appState.movies)),
      // filter(([_, movies]) => movies.length === 0),
      switchMap(() =>
        this.moviesService.fetchMovies().pipe(
          map(res => {
            const movies: Movie[] = res?.results?.reduce((list: Movie[], movie: any, index: number) => {
              const { title, opening_crawl, characters, release_date, url } = movie;
              list.push({
                id: index+1,
                title,
                opening_crawl,
                release_date,
                characterIds: this.moviesService.extractIDs(characters, 'people'),
                url
              })
              return list;
            }, [])
            return fetchingMoviesSuccess({ movies })
          })
        )
      )
    )
  )

    // First check if action.moviedId exists in movies array of store, if yes just proceed to fetch characters 
    // of that movie by movie.characterIds (that are missing in the characters array in the store). 
    // If action.movieId doesn't exist in movies array of store then send an 
    // http request to this.fetchSingleMovie(action.movieId) and for each movie.characterIds (that are missing in characters array in store)
    // to this.moviesService.fetchCharacters(movie.characterId) then dispath fetchingMovieSuccess and fetchCharactersSuccess actions.
  loadSingleMovie$ = createEffect(() => 
    this.actions$.pipe(
    ofType(startFetchingSingleMovie),
    withLatestFrom(
      this.store.select(state => state.appState.movies),
      this.store.select(state => state.appState.characters)
    ),
    switchMap(([action, movies, charactersFromStore]) => {
      const movieId = action.movieId;

      // 1️⃣ Check if movie already exists in store
      const existingMovie = movies.find((movie: Movie) => movie.id === movieId);

      if (existingMovie) {
        // Movie exists → fetch only missing characters
        return this.fetchMissingCharacters(existingMovie, charactersFromStore);
      }

      // 2️⃣ Movie not in store → fetch movie first
      return this.moviesService.fetchSingleMovie(movieId).pipe(
        switchMap((movie: Movie) => {
          // dispatch movie result
          const movieAction = fetchingSingleMovieSuccess({ movie });

          return this.fetchMissingCharacters(movie, charactersFromStore).pipe(
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
        this.store.select(state => state.appState.movies),
        this.store.select(state => state.appState.characters)
      ),
      switchMap(([action, movies, characters]) => {
        const characterId = action.characterId;

        const existingCharacter = characters.find((character: Character) => character.id === characterId);

        if (existingCharacter) {
          return this.fetchMissingMovies(existingCharacter, movies);
        }

        return this.moviesService.fetchCharacter(characterId).pipe(
          switchMap((character: Character) => {
            const characterAction = fetchingSingleCharacterSuccess({ character })

            return this.fetchMissingMovies(character, movies).pipe(
              startWith(characterAction)
            )
          })
        )
      })
    )
  )

fetchMissingCharacters(movie: Movie, characters: Character[]) {
  const missingIds = movie.characterIds?.filter(
    id => !characters.some(c => c.id === id)
  );

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

  fetchMissingMovies(character: Character, movies: Movie[]) {
    const missingIds = character.filmIds.filter(id => !movies.some(movie => movie.id === id));

    if (missingIds.length === 0) {
      return of(fetchingMoviesSuccess({ movies :[] }));
    };

    return forkJoin(
      missingIds.map(id => this.moviesService.fetchSingleMovie(id))).pipe(
        map((fetchedMovies: any[]) => {
          const formattedMovies = fetchedMovies?.map((fetchedMovie, index) => {
            const { title, opening_crawl, characters, release_date, url } = fetchedMovie;
            return {
              id: +index,
              title,
              opening_crawl,
              release_date,
              characterIds: this.moviesService.extractIDs(characters, 'people'),
              url
            }
          })
          return fetchingMoviesSuccess({ movies: formattedMovies })
        })
      )
  }
}