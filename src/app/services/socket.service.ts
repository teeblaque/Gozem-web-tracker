import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() { 
    this.socket = io('http://localhost:9000');
  }

  onDeliveryUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('delivery_updated', (data) => {
        observer.next(data);
      });
    });
  }
}
