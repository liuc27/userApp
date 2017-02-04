/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
import { CheckLogin } from '../../../providers/check-login'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import moment from 'moment';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';


@Component({
  selector: 'page-myInformation',
  templateUrl: 'myInformation.html',
  providers: [CheckLogin]
})
export class MyInformation {

  username: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  private validation:any = {};

  uploadedImg = {data: undefined};

  constructor(private navController: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http) {
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

  uploadImage(event) {
    console.log("upla")
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
      self.validation.imageURL = reader.result;
      self.presentToast()

    }
    reader.readAsDataURL(file);

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '添加成功',
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }

  login() {
    console.log(this.validation)
    this.http.post('http://localhost:8080/api/login', this.validation)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        if (data != null) {
          if (data.data == "OK") {
            console.log(data)
            this.storage.set('validation', this.validation).then((data) => {

              if (data == null) console.log("error");
              else {
                this.alreadyLoggedIn.data = true;
                location.reload();
              }
            });
          } else if (data.data == "NO") {
            alert("account already exists and the password was wrong")
          } else {
            alert("registered")
            this.storage.set('validation', this.validation).then((data) => {
              console.log(data)
              if (data == null) console.log("error");
              else {
                this.alreadyLoggedIn.data = true;
                location.reload();
              }
            });
          }
        }
      });
  }
}
