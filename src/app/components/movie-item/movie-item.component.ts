import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { Movie } from '../../movie.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { startFetchingSingleMovie } from '../../store/movies.actions';
import { Character } from '../../character.model';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-movie-item',
  imports: [NgFor, NgIf, AsyncPipe, MatProgressSpinnerModule, DatePipe],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss'
})
export class MovieItemComponent implements OnInit {

  public movie$!: Observable<Movie>;
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public movieAndItsCharacters$!: Observable<{
    movie: Movie | undefined,
    characters: Character[]
  }>;
  public loadingCharacters$!: Observable<boolean>;

  ngOnInit(): void {
    this.movieAndItsCharacters$ = combineLatest([
      this.route.params.pipe(
        tap(params => this.store.dispatch(startFetchingSingleMovie({ movieId: +params['id'] })))
      ),
      this.store.select(state => state.appState.movies),
      this.store.select(state => state.appState.characters),
    ]).pipe(
      map(([params, movies, characters]) => {
        const id = +params['id'];
        const movie = movies.find((m: Movie) => m.id === id);

        return {
          movie,
          characters:
            movie
              ? characters.filter((c: any) => movie.characterIds.includes(c.id))
              : []
        };
      })
    );

    this.loadingCharacters$ = this.store.select(state => state.appState.fetchingCharacters);
  }

  fetchSingleCharacter(url: string) {
    const match = url?.match(/\/people\/(\d+)\//);
    const id = match && Number(match[1])
    this.router.navigate(['/character', id])
  }

}
