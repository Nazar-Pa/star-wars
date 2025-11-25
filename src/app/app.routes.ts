import { Routes } from '@angular/router';
import { HomeComponent } from './features/movies/components/home/home.component';
import { MovieItemComponent } from './features/movies/components/movie-item/movie-item.component';
import { CharacterItemComponent } from './features/movies/components/character-item/character-item.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'movie/:id', component: MovieItemComponent
  },
  {
    path: 'character/:id', component: CharacterItemComponent
  }
];
