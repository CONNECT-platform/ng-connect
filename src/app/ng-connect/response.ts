import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { Signature } from './signature';


export class Response {
  private _outputs : {[out:string]: EventEmitter<any>} = {};
  private _controls: {[control:string]: EventEmitter<void>} = {};

  constructor(
    observable: Observable<any>,
    signature: Signature
  ){
    if (signature.outputs)
      signature.outputs.forEach(out => this._outputs[out] = new EventEmitter<any>());
    if (signature.controlOutputs)
      signature.controlOutputs.forEach(control => this._controls[control] = new EventEmitter<void>());

    observable.subscribe(response => {
      if (typeof response == 'string') {
        if (signature.controlOutputs.includes(response)) {
          this.control[response].emit();
        }
        else throw new Error('Unrecognized control output:: ' + response);
      }
      else {
        for (let key of Object.keys(response)) {
          if (signature.outputs.includes(key)) {
            this.out[key].emit(response[key]);
            return;
          }
        }

        throw new Error('Unrecognized output.');
      }
    });
  }

  public get out(): {[out:string]: EventEmitter<any>} { return this._outputs; }
  public get control(): {[control:string]: EventEmitter<any>} { return this._controls; }
}
