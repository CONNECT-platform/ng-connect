import { Injectable } from '@angular/core';
import { NgConnectModule } from './ng-connect.module';
import { HttpClient } from '@angular/common/http';

import { ConnectBackend } from './connect-backend';

@Injectable({
  providedIn: NgConnectModule,
})
export class NgConnectService {

  constructor(private http: HttpClient) {}

  createBackend(uri): ConnectBackend {
    return new ConnectBackend(uri, this.http);
  }
}
