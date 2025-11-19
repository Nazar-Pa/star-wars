import { Component, inject, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { startFetchingMovies } from '../../store/movies.actions';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Movie } from '../../movie.model';
import { Router } from '@angular/router';
import { MoviesService } from '../../movies.service';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, NgIf, MatProgressSpinnerModule, NgFor, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public moviesLoading$!: Observable<boolean>;
  private store = inject(Store);
  public movies$!: Observable<Movie[]>;
  private router = inject(Router);
  private movieService = inject(MoviesService);

  constructor() {
    this.movies$ = this.store.select(state => state.appState.movies);
  }

  ngOnInit(): void {
    this.store.dispatch(startFetchingMovies());
    this.moviesLoading$ = this.store.select(state => state.appState.fetchingMovies);
    this.movieService.fetchSingleMovie(2).subscribe(res => console.log(res))
    this.movieService.fetchSingleMovieObs(2).subscribe(res => console.log(res));
  }

    fetchSingleMovie(url: string | undefined) {
    const match = url?.match(/\/films\/(\d+)\//);
    const id = match && Number(match[1])
    this.router.navigate(['/movie', id])
  }
}
