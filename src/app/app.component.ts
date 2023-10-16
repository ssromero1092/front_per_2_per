import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { ApiService } from './utils/api.service';
//import { FunctionsService } from './utils/functions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front_per_2_per';
  constructor(
    private router: Router,
    //private api: ApiService,
    //private fn: FunctionsService
  ) {



  }
}
