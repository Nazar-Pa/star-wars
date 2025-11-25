import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, of, switchMap } from "rxjs";
import { Character } from "../../features/movies/models/character.model";
import { Movie } from "../../features/movies/models/movie.model";

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private baseUrl = 'https://swapi.dev/api/'
  private http = inject(HttpClient);

  fetchMovies2() {
    return this.http.get<any>(`${this.baseUrl}films`)
  }

  fetchMovies() {
    return this.http.get<any>(`${this.baseUrl}films`).pipe(
      map(response => {
                  const movies: Movie[] = response?.results?.reduce((list: Movie[], movie: any, index: number) => {
                    const { title, opening_crawl, characters, release_date, url } = movie;
                    list.push({
                      id: index + 1,
                      title,
                      opening_crawl,
                      release_date,
                      characterIds: this.extractIDs(characters, 'people'),
                      url
                    })
                    return list;
                  }, [])
                  return movies
                })
    )
  }

  fetchSingleMovie(id: number): Observable<Movie> {
    return this.http.get<any>(`${this.baseUrl}films/${id}`).pipe(
      map(response => {
        const { title, opening_crawl, characters, release_date, url } = response;
        const movie = {
          id,
          title,
          opening_crawl,
          release_date,
          characterIds: this.extractIDs(characters, 'people'),
          url
        };
        return movie;
      })
    )
  }

    fetchSingleMovieObs(id: number): Observable<Movie> {
    return this.http.get<any>(`${this.baseUrl}films/${id}`).pipe(
      switchMap(response => {
        const { title, opening_crawl, characters, release_date, url } = response;
        const movie = {
          id,
          title,
          opening_crawl,
          release_date,
          characterIds: this.extractIDs(characters, 'people'),
          url
        };
        return of(movie);
      })
    )
  }

  fetchCharacter(id: number): Observable<Character> {
    return this.http.get<any>(`${this.baseUrl}people/${id}`).pipe(
      map(response => {
        const { name, height, mass, gender, films, url} = response;
        const character = {         
          id,    
          name,
          height,
          mass,
          gender,
          filmIds: this.extractIDs(films, 'films'),
          url        
        };
        return character;
      }),
    );
  }

  extractIDs(urls: string[], path: string): number[] {
    const regex = new RegExp(`/${path}/(\\d+)/`);
    const ids = urls.map(url => {
      const match = url.match(regex);
      return match && Number(match[1]);
    });
    return ids as number[];
  }
}