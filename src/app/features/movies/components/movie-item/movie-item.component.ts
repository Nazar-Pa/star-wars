import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, filter, map, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../models/character.model';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { selectAnyLoading, selectCharactersByIds, selectCharactersLoading, selectMovieById, selectMoviesLoading } from '../../store/movies.selectors';
import { startFetchingSingleMovie } from '../../store';
import { MoviesFacade } from '../../store/movies.facade';

@Component({
  selector: 'app-movie-item',
  imports: [NgFor, NgIf, AsyncPipe, MatProgressSpinnerModule, DatePipe],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss'
})
export class MovieItemComponent implements OnInit {

  public movie$!: Observable<Movie>;
  public characters$!: Observable<Character[]>;
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private moviesFacade = inject(MoviesFacade);
  // public loadingMovies$ = this.store.select(selectMoviesLoading);
  // public loadingCharacters$ = this.store.select(selectCharactersLoading);
  public anyLoading$!: Observable<boolean>;

  ngOnInit(): void {

    this.movie$ = this.route.params.pipe(
      map(params => +params['id']),
      tap(id => this.moviesFacade.loadMovie(id)),
      switchMap(id => this.moviesFacade.movie$(id).pipe(
        filter((movie): movie is Movie => !!movie)
      ))
    );

    this.characters$ = this.route.params.pipe(
      map(params => +params['id']),
      switchMap(id => this.moviesFacade.charactersForMovie$(id))
    );

    this.anyLoading$ = this.moviesFacade.anyLoading$;
  }

  fetchSingleCharacter(url: string) {
    const match = url?.match(/\/people\/(\d+)\//);
    const id = match && Number(match[1])
    this.router.navigate(['/character', id])
  }

}
