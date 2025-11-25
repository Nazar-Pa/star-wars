import { Component, inject, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { startFetchingMovies } from '../../store/movies.actions';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Movie } from '../../models/movie.model';
import { Router } from '@angular/router';
import { MoviesService } from '../../../../core/services/movies.service';
import { selectAllMovies, selectMoviesLoading } from '../../store/movies.selectors';
import { MoviesFacade } from '../../store/movies.facade';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, NgIf, MatProgressSpinnerModule, NgFor, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private moviesFacade = inject(MoviesFacade);
  movies$ = this.moviesFacade.allMovies$;
  moviesLoading$ = this.moviesFacade.moviesLoading$;

  ngOnInit(): void {
    this.moviesFacade.loadMovies();
  }

    fetchSingleMovie(url: string | undefined) {
    const match = url?.match(/\/films\/(\d+)\//);
    const id = match && Number(match[1])
    this.router.navigate(['/movie', id])
  }
}
