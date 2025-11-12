import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private base = `${environment.apiUrl}/items`;
  constructor(private http: HttpClient) {}

  list(): Observable<Item[]> {
    return this.http.get<Item[]>(this.base);
  }

  get(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.base}/${id}`);
  }

  create(data: Item): Observable<Item> {
    return this.http.post<Item>(this.base, data);
  }

  update(data: Item): Observable<void> {
    return this.http.put<void>(`${this.base}/${data.id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
