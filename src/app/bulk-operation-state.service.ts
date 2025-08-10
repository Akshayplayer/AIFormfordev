import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BulkOperationState {
  inProgress: boolean;
  success?: boolean;
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class BulkOperationStateService {

  private stateSubject = new BehaviorSubject<BulkOperationState>({ inProgress: false });
  state$ = this.stateSubject.asObservable();

  setState(state: BulkOperationState) {
    this.stateSubject.next(state);
  }

  reset() {
    this.stateSubject.next({ inProgress: false });
  }
}
