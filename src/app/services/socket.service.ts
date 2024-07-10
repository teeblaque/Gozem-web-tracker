import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() { 
    this.socket = io('http://localhost:9000');
  }

  onEvent(event: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }

  emitEvent(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
