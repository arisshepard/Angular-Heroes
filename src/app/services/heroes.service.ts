import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private url = 'https://login-app-c5f7c.firebaseio.com';

  constructor(private http: HttpClient) {}

  actualizarHeroe(heroe: HeroeModel): Observable<any> {
    const heroeTemp = {
      ...heroe,
    };

    delete heroeTemp.id;

    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp);
  }

  borrarHeroe(id: string): Observable<any> {
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  crearHeroe(heroe: HeroeModel): Observable<HeroeModel> {
    const heroeTemp = {
      ...heroe,
    };

    delete heroeTemp.id;

    return this.http.post(`${this.url}/heroes.json`, heroeTemp).pipe(
      map((respuesta: any) => {
        heroe.id = respuesta.name;
        return heroe;
      })
    );
  }

  getHeroe(id: string): Observable<any> {
    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  getHeroes(): Observable<HeroeModel[]> {
    return this.http.get(`${this.url}/heroes.json`).pipe(
      map((respuesta) => this.crearArreglo(respuesta)),
      delay(1500)
    );
  }

  private crearArreglo(heroesObj: object): HeroeModel[] {
    const heroes: HeroeModel[] = [];
    // console.log(heroesObj);

    if (heroesObj === null) {
      return [];
    }

    Object.keys(heroesObj).forEach((key) => {
      const heroe: HeroeModel = heroesObj[key];

      heroe.id = key;
      heroes.push(heroe);
    });

    return heroes;
  }
}
