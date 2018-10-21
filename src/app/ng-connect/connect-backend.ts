import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

import { Signature } from './signature';
import { Response } from './response';


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

  call(path: string, inputs?: {[input:string]: any}): Response {
    let signature = this.registry[path];
    if (signature) {
      let method = signature.method;
      let request: Observable<any>;

      if (signature.inputs)
        signature.inputs.forEach(input => {
          if (!inputs || !(input in inputs))
            throw new Error(`missing input: ${input}`);
        });

      switch(method) {
        case 'DELETE':
          request = this.http.delete(this.uri + signature.path, {
            params: inputs || {},
          });
          break;
        case 'POST':
          request = this.http.post(this.uri + signature.path, inputs || {});
          break;
        case 'PUT':
          request = this.http.put(this.uri + signature.path, inputs || {});
          break;
        case 'GET':
        default:
            request = this.http.get(this.uri + signature.path, {
              params: inputs || {},
            });
            break;
      }

      return new Response(request, signature);
    }
    else
      throw new Error(`no path ${path} on CONNECT instance @ ${this.uri}`);
  }

  get onConnected(): EventEmitter<void> { return this._onConnected; }
  get paths(): string[] { return Object.keys(this.registry); }
}
