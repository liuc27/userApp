import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Storage } from '@ionic/storage'
import {SignUp} from './signUp/signUp'
import { MyInformation } from './myInformation/myInformation'
import { MyFavorites } from './myFavorites/myFavorites';
import { MyReservations } from './myReservations/myReservations';
import { MyCoupons } from './myCoupons/myCoupons';
import { MyFriends } from './myFriends/myFriends';

import { CheckLogin } from '../../providers/check-login'


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var Wechat:any;

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [CheckLogin]
})
export class SettingsPage {

  username: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = false;
  nicknameOrUsername: String;
  validation : any = {};

  constructor(private nav: NavController,
    private events: Events,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public platform: Platform,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');


    this.checkLogin.load()
      .then(data => {
        console.log(data)
        this.validation = data
        this.alreadyLoggedIn = true;
        if(this.validation.nickname){
          this.nicknameOrUsername = this.validation.nickname
        }else if(this.validation.username){
          this.nicknameOrUsername = this.validation.username
        }
      });

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

  login() {
    console.log(this.validation)
    console.log("start login")
    this.http.post('http://localhost:8080/api/login', this.validation)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        if (data != null) {
          if (data.data == "OK") {
            console.log(data)
            this.storage.set('validation', this.validation).then((data2) => {

              if (data2 == null) console.log("error");
              else {
                this.alreadyLoggedIn = true;
                this.validation = data;
              }
            });
          } else if (data.data == "NO") {
            alert("account already exists and the password was wrong")
          } else {
            alert("account not exists")
          }
        }
      });
  }

  register() {
    this.nav.push(SignUp);
  }

  myInformation(){
    this.nav.push(MyInformation);
  }
  myReservations(){
    this.nav.push(MyReservations);
  }
  myFavorites(){
    this.nav.push(MyFavorites);
  }
  myCoupons(){
    this.nav.push(MyCoupons);
  }
  myFriends(){
    this.nav.push(MyFriends);
  }


  logout() {
    this.validation.username = null
    this.validation.nickname = null
    this.validation.password = null


    this.alreadyLoggedIn = false
    console.log(this.alreadyLoggedIn)
    this.storage.remove('validation').then(data1 => {
      console.log(data1)
      console.log("data1")
      this.nav.setRoot(SettingsPage)

    })
  }

  openOauth(oauthName) {
    if(oauthName == "wechat"){
      if(this.platform.is('ios')||this.platform.is('android')) {
      var scope = "snsapi_userinfo",
          state = "_" + (+new Date());
          var that = this;
      Wechat.auth(scope, state, function (response) {
          // you may use response.code to get the access token.
          console.log((response));
          that.http.post('http://localhost:8080/api/wechatLogin', response)
            .map(res => res.json())
            .subscribe(data => {
              if(data.username && data.nickname){
              that.alreadyLoggedIn = true;
              that.validation = data

              that.storage.set('validation', that.validation).then((data2) => {
                if (data2 == null) console.log("error");
                else {
                alert("successfully login with wechat")
                  window.location.reload()
                }
              });
              }
            })

      }, function (reason) {
          alert("Failed: " + reason);
      });
      }
    }else{
    console.log("we will soon add this function")
  }
  }
}
