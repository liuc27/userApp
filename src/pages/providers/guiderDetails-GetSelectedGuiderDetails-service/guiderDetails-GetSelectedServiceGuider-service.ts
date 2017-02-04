import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the ProductListsGetSelectedProductLists provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class getSelectedGuiderDetails {
  data: any;
  perpage:number = 20;

  constructor(private http: Http) {
    this.data = null;
  }

  load(start:number,category:String,guiderName:String) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      return new Promise(resolve => {
        this.http.get('http://localhost:8080/api/product?limit='+this.perpage+'&skip='+start+'&category='+category+'&guiderName='+guiderName)
          .map(res => res.json())
          .subscribe(data => {
            console.log(data)
            this.data = data;
            resolve(this.data);
          });
      });

    });
  }
}
