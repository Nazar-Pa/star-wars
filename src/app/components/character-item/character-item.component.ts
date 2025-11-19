import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { Character } from '../../character.model';
import { Movie } from '../../movie.model';
import { startFetchingSingleCharacter } from '../../store/movies.actions';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  public characterAndItsMovies$!: Observable<{
    character: Character,
    movies: Movie[]
  }>;
  public loadingMovies$!: Observable<boolean>;

  ngOnInit(): void {
    this.characterAndItsMovies$ = combineLatest([
      this.route.params.pipe(
        tap(params => this.store.dispatch(startFetchingSingleCharacter({ characterId: +params['id'] })))
      ),
      this.store.select(state => state.appState.characters),
      this.store.select(state => state.appState.movies)
    ]).pipe(
      map(([params, characters, movies]) => {
        const id = +params['id'];

        const character = characters.find((c: Character) => c.id === id);

        const mos = movies.filter((m: Movie) => character.filmIds.includes(m.id))

        return {
          character, 
          movies: mos
        }
      })
    );

    this.loadingMovies$ = this.store.select(state => state.appState.fetchingMovies);
  }

    fetchSingleMovie(url: string) {
    const match = url?.match(/\/films\/(\d+)\//);
    const id = match && Number(match[1])
    this.router.navigate(['/movie', id])
  }

}
