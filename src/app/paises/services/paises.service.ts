import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { PaisFull, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private _baseURL: string = 'https://restcountries.com/v3.1'

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private httpClient: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseURL}/region/${region}?fields=cca3,name`;
    return this.httpClient.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(pais: string): Observable<PaisFull[]> {

    if(!pais) {
      return of([]);
    }

    const url: string = `${this._baseURL}/alpha/${pais}`;
    return this.httpClient.get<PaisFull[]>(url);
  }

  getPaisesPorCodigos(borders: PaisFull[]): Observable<PaisSmall[]> {

    if(borders.length == 0 || !borders[0].borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders[0].borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }

  getPaisPorCodigoSmall(pais: string): Observable<PaisSmall> {
    const url: string = `${this._baseURL}/alpha/${pais}?fields=cca3,name`;
    return this.httpClient.get<PaisSmall>(url);
  }
}
