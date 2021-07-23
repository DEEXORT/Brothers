import {Injectable} from '@angular/core';
import {IUser, IUserStats} from '../interfaces/user';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {setting} from '../consts/settings';
import {IPlayer} from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) {
  }

  public async save(table: string, data: any): Promise<number> {
    return await this.http.post(
      `${setting.connect}/api/save`,
      {
        table, data
      },
      {
        observe: 'response'
      })
      .pipe(
        map(response => {
          const body: any = response.body;
          return body.insertId;
        })
      )
      .toPromise();
  }

  public async get<T>(data: any): Promise<T> {
    return await this.http.post(
      `${setting.connect}/api/get`, data,
      {
        observe: 'response'
      })
      .pipe(
        map(response => {
          if (response.ok) {
            return response.body as T;
          } else {
            console.log(response.status);
            return null;
          }
        })
      )
      .toPromise();
  }

  public async login<T>(data: any): Promise<T> {
    return await this.http.post(
      `${setting.connect}/api/login`, data,
      {
        observe: 'response'
      })
      .pipe(
        map(response => {
          if (response.ok) {
            return response.body as T;
          } else {
            console.log(response.status);
            return null;
          }
        })
      )
      .toPromise();
  }

  public async getAll<T>(table: string, filters: string): Promise<Array<T>> {
    return await this.http.post(
      `${setting.connect}/api/get_all`,
      {table, filters},
      {
        observe: 'response'
      })
      .pipe(
        map(response => {
          if (response.ok) {
            return response.body as Array<T>;
          } else {
            console.log(response.status);
            return [];
          }
        })
      )
      .toPromise();
  }

  public async update<T>(table: string, id: number, data: T, key: string): Promise<boolean> {
    return await this.http.post(
      `${setting.connect}/api/update`,
      {table, id, data, key},
      {
        observe: 'response'
      })
      .pipe(
        map(response => {
          return response.ok;
        })
      )
      .toPromise();
  }

  public async delete(table: string, id: number, key: string): Promise<boolean> {
    return await this.http.post(
      `${setting.connect}/api/delete`,
      {table, id, key},
      {
        observe: 'response'
      })
      .pipe(
        map(response => {
          return response.ok;
        })
      )
      .toPromise();
  }

}
