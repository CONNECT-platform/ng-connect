import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

import { Signature } from './signature';


export class ConnectBackend {
  registry: { [path: string]: Signature; }

  _onConnected: EventEmitter<void> = new EventEmitter<void>();

  constructor(private uri: string, private http: HttpClient) {}

  connect(): EventEmitter<void> {
    this.http.get(this.uri + '/api').subscribe((registry: Signature[]) => {
      this.registry = {};
      registry.forEach((signature: Signature) => this.registry[signature.path] = signature);
      this._onConnected.emit();
    });

    return this._onConnected;
  }

  call(path, inputs?): Observable<any> {
    let signature = this.registry[path];
    if (signature) {
      let method = signature.method;
      let request: Observable<any>;
      switch(method) {
        case 'DELETE':
          request = this.http.delete<any>(this.uri + signature.path);
          break;
        case 'GET':
        default:
            request = this.http.get<any>(this.uri + signature.path);
            break;
      }

      return request.pipe(map(response => this.process(response, signature)));
    }
    else
      throw new Error(`no path ${path} on CONNECT instance @ ${this.uri}`);
  }

  public process(response:any, signature: Signature):any {
    let result;

    if (signature.outputs) {
      let keys = Object.keys(response);
      keys.forEach(key => {
        if (signature.outputs.includes(key)) {
          result = response[key];
          return;
        }
      });
    }

    return result;
  }

  get onConnected(): EventEmitter<void> { return this._onConnected; }
  get paths(): string[] { return Object.keys(this.registry); }
}
