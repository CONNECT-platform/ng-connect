# NgConnect

Easy interface with CONNECT platform instances. 

_I mean, its generally not tough to interface with backend services in angular, and CONNECT platform instances are also pretty straight-forward. However, I am personally the lazy type, and since the signature of CONNECT instances is known before hand and is pretty easy to handle, this would make it easier on the client side to speak with them. Note that of course this package can work with any **InterConnectible** service._

## How To Install

```bash
npm install ng-connect
```

## How To Import

Import the module `NgConnectModule` and the service `NgConnectService` in your main module file (`app.module.ts`),
add `NgConnectModule` to `@NgModule`'s `imports` field and `NgConnectService` to its `providers` field:

```typescript
import { NgConnectModule } from 'ng-connect/ng-connect.module';
import { NgConnectService } from 'ng-connect/ng-connect.service';

@NgModule({

  /* ... */
  
  imports: [
    /* ... */
    NgConnectModule,
  ],
  providers: [
    /* ... */
    NgConnectService,
  ],
  
  /* ... */
  
})
export class AppModule { /* ... */ }

```

## How To Use

You need to create one backend instance per backend service you want to connect to. I would personally suggest creating a service that manages these backend instances, however you can create them wherever you have access to DI.

```typescript
import { NgConnectService } from './ng-connect/ng-connect.service';
import { ConnectBackend } from './ng-connect/connect-backend';

class SomeDIInitiatedClass {
  private backend: ConnectBackend;

  constructor(connect: NgConnectService) {
    this.backend = connect.createBackend('https://my-connect-backend.connect-platform.com');
    
    //
    // the backend does not connect itself, to give you control over when to connect it.
    //
    this.backend.connect().subscribe(() => console.log('CONNECTED!'));    
  }
}
```

Then you can make calls to backend nodes easily:

```typescript
let response = this.backend.call('/some/node/', { 
  a: 'some value',
  b: 'some other value',
 });
 
response.out.X.subscribe(outX => console.log('X:: ' + outX));
response.out.Y.subscribe(outY => console.log('Y:: ' + outY));
response.control.Z.subscribe(() => console.log('Z!'));
```

this is assuming that `/some/node/` has the following signature:

```json
{
  "path" : "/some/node",
  "inputs" : ["a", "b"],
  "outputs" : ["X", "Y"],
  "controlOutputs" : ["Z"]
}
```

the backend will receive the whole registry signature upon connection (invokation of `connect()`), and hence will automatically figure out the proper method of the request, the proper way to send the data, etc. if insufficient inputs are provided, the backend will check on the client side and throw proper errors.

**NOTE** the request will be made upon invokation of `backend.call()` and does not matter if you subscribe to the response object or not. If you subscribe after the server has responded, obviously you will miss out on the data.
