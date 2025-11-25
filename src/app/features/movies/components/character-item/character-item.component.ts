import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';
import { Character } from '../../models/character.model';
import { Movie } from '../../models/movie.model';
import { startFetchingSingleCharacter } from '../../store/movies.actions';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MoviesFacade } from '../../store/movies.facade';

@Component({
  selector: 'app-character-item',
  imports: [NgFor, NgIf, AsyncPipe, MatProgressSpinnerModule],
  templateUrl: './character-item.component.html',
  styleUrl: './character-item.component.scss'
})
export class CharacterItemComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private moviesFacade = inject(MoviesFacade);
  public characterAndItsMovies$!: Observable<{
    character: Character | undefined,
    movies: Movie[]
  }>;
  public loadingMovies$!: Observable<boolean>;

  ngOnInit(): void {

    this.characterAndItsMovies$ = this.route.params.pipe(
      tap(params =>
        this.moviesFacade.loadCharacter(+params['id'])
      ),
      switchMap(params => {
        const id = +params['id'];

        return combineLatest([
          this.moviesFacade.character$(id),
          this.moviesFacade.allMovies$
        ]).pipe(
          map(([character, movies]) => ({
            character,
            movies: movies.filter(m => character?.filmIds.includes(m.id))
          }))
        );
      })
    );

    this.loadingMovies$ = combineLatest([
      this.moviesFacade.charactersLoading$,
      this.moviesFacade.moviesLoading$
    ]).pipe(
      map(([c, m]) => c || m)
    );
  }

  fetchSingleMovie(url: string) {
    const match = url?.match(/\/films\/(\d+)\//);
    const id = match && Number(match[1])
    this.router.navigate(['/movie', id])
  }

}
