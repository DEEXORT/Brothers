import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiModalService {
  private modal$: Subject<any> = new Subject<any>();

  constructor() {
  }

  public getModalSubscribe(): Observable<any> {
    return this.modal$.pipe();
  }

  public initModal(v: any): void {
    this.modal$.next(v);
  }

}




