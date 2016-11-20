import {Component} from '@angular/core';
import {NavController,Events} from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {Storage} from '@ionic/storage'

import {CheckLogin} from '../../providers/check-login'


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers:[CheckLogin]
})
export class SettingsPage {

  username:String;
  password:String;
  param: string = "world";
  alreadyLoggedIn = {data:false};
  validation = {
    username: undefined,
    password: undefined
  };

  constructor(private navController: NavController,
              private events: Events,
              translate: TranslateService,
              public storage:Storage,
              public checkLogin:CheckLogin,
              private http:Http) {
    translate.setDefaultLang('en');
    translate.use('en');


    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
      });

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

  login(){
    console.log(this.validation)
    this.http.post('http://localhost:8080/api/login',this.validation)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        if(data!=null){
        if(data.data == "OK"){
          console.log(data)
          this.storage.set('validation',this.validation).then((data) => {

            if (data == null) console.log("error");
            else {
              this.alreadyLoggedIn.data = true;
              location.reload();
            }
          });
        }else if(data.data == "NO"){
          alert("account already exists and the password was wrong")
        }else{
          alert("registered")
        }
        }
      });
  }

logout(){
    this.validation.username = null
    this.validation.password = null

    this.alreadyLoggedIn.data = false
    console.log(this.alreadyLoggedIn)
        this.storage.remove('validation').then(data1 => {
          console.log(data1)
          console.log("data1")
        })
}

  openOauth(oauthName){
    console.log(oauthName);
  }
}
