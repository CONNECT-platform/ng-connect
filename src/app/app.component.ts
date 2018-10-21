import { Component } from '@angular/core';
import { NgConnectService } from './ng-connect/ng-connect.service';
import { ConnectBackend } from './ng-connect/connect-backend';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  backend: ConnectBackend;

  constructor(private connectService: NgConnectService) {
    this.backend = connectService.createBackend('http://localhost:4000');

    this.backend.connect().subscribe(() => {
      let r = this.backend.call('/factoriel/', {
        number: 8,
      });
      r.out.factoriel.subscribe(val => console.log(val));
    });
  }
}
