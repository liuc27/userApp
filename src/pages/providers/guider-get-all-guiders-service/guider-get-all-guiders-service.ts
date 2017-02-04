import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GuiderGetAllGuidersService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GuiderGetAllGuidersService {
  data: any ;
  perpage:number = 20;

  constructor(private http: Http) {
    this.data = [];
  }

  load(start:number,category:String) {
    return new Promise(resolve => {
      this.http.get('http://localhost:8080/api/guiders?limit='+this.perpage+'&skip='+start+'&category='+category)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
