import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, tap, timeout } from 'rxjs';
import { Good, IGoodGroupDto } from '../models/api-models';
import { environment } from '../../../environments/environment';

type Parameter = {
  page?: number;
  per_page?: number;
  searchKey?: string;
  sort?: 0 | 1;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getGoods(parameters: Parameter) {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(parameters)) {
      params = params.append(key, value);
    }
    console.log('request sent getGoods', params);
    return this.http.post<any>(environment.apiUrl + 'Goods/GetGoods', {}, { params: params }).pipe(
      take(1),
      timeout(13000)
    );
  }

  getBrands(parameters: Parameter) {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(parameters)) {
      params = params.append(key, value);
    }
    return this.http.get<any>(environment.apiUrl + 'Goods/GetBrands', { params: params }).pipe(
      take(1),
      timeout(13000)
    );
  }

  getGoodById(id: string) {
    return this.http.get<{ data: Good }>(environment.apiUrl + 'Goods/GetGoodById', { params: new HttpParams().append('id', id) }).pipe(
      tap(console.log),
      take(1),
      timeout(13000)
    );
  }

  getGoodGroups(parameters: Parameter) {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(parameters)) {
      params = params.append(key, value);
    }
    return this.http.get<{ data: IGoodGroupDto[] }>(environment.apiUrl + 'GoodGroups/GetGoodGroups', { params: params }).pipe(
      take(1),
      timeout(13000)
    );
  }
}
