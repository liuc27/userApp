import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the productDetailsGetSelectedProductDetails provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class getSelectedProductDetails {
  data: any;

  constructor(private http: Http) {
    this.data = null;
  }

  load(id) {

    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('http://localhost:8080/api/productDetails?_id='+id)
        .map(res => res.json())
        .subscribe(data => {
          console.log("productDetails")
          console.log(data)
          this.data = data;
          //resolve(this.data._body);
          resolve(this.data);
        });
    });
  }
}
