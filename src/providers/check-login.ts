import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage'

/*
  Generated class for the CheckLogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CheckLogin {

  validation : any = {};
  data: any;

  constructor(public http: Http, public storage:Storage,) {
    this.data = null;

  }

  updateLikedProduct(newLikedProduct){
    if(this.data){
      this.data.likedProduct = newLikedProduct
      this.storage.set('validation', this.data)
      console.log(this.data)
    }
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.

      this.storage.get('validation').then(data1 => {
        if (data1) {
          console.log("data1 exists")
          console.log(data1)
          if (data1.username) {
            // console.log("signIn")
            this.http.post('http://localhost:8080/api/login', data1)
              .map(res => res.json())
              .subscribe(data2 => {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (data2) {
                  if (data2.data == "OK") {
                    // console.log(data2)
                    this.storage.set('validation', data2);

                    this.data = data2;
                    // console.log(this.data)
                    resolve(this.data);

                  } else if (data2.data == "NO") {
                    this.storage.remove('validation')
                    // console.log("account already exists and the password was wrong")
                                    resolve(this.data);

                  } else {
                    // console.log(this.data)
                  }
                }

              });
          } else {
            console.log("notSignIn")
          }
        } else {
          console.log("empty")
        }
      })
    })
  }
}
