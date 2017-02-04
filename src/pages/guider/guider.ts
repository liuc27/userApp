/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, } from 'ionic-angular';
import { guiderPop1 } from "./popoverPages/guiderPop1";
import { guiderPop2 } from "./popoverPages/guiderPop2";
import { guiderPop3 } from "./popoverPages/guiderPop3";
import { GuiderGetAllGuidersService } from '../providers/guider-get-all-guiders-service/guider-get-all-guiders-service';
import { GuiderDetails } from './guiderDetails/guiderDetails';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CheckLogin } from '../../providers/check-login'
import { Storage } from '@ionic/storage'

@Component({
  selector: "page-Guider",
  templateUrl: 'guider.html',
  providers: [GuiderGetAllGuidersService, CheckLogin]
})
export class GuiderPage {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  guiders: any = [];
  alreadyLoggedIn = false;
  validation : any = {};
  start = 0
  category = "all"
  infiniteScrollEnd = false

  constructor(private params: NavParams,
    private nav: NavController,
    private events: Events,
    private guiderGetAllGuidersService: GuiderGetAllGuidersService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public popoverCtrl: PopoverController,
    private http: Http) {
    this.events = events;
    this.loadGuiders();
    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
  }

  ionViewWillEnter() {
    console.log("send showTabs event")
    this.events.publish('showTabs');
  }

  loadGuiders() {
      return new Promise(resolve => {
      console.log(this.start)
          this.guiderGetAllGuidersService.load(this.start,this.category)
          .then(data => {
            console.log("data")
            console.log(data)
            if(Object.keys(data).length==0){
            this.start-=20
            }
            this.guiders = this.guiders.concat(data)
            resolve(true);
          });
        });
  }

  openGuiderDetailsPage(guider) {
    console.log(guider);
    guider.from = "guiderPage"
    this.nav.push(GuiderDetails, guider);
  }
  presentGuiderPop1Popover(ev) {
    let guiderPop1Page = this.popoverCtrl.create(guiderPop1, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(guiderPop1Page, {
      ev: ev
    });
  }

  presentGuiderPop2Popover(ev) {
    let guiderPop2Page = this.popoverCtrl.create(guiderPop2, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(guiderPop2Page, {
      ev: ev
    });
  }

  presentGuiderPop3Popover(ev) {
    let guiderPop3Page = this.popoverCtrl.create(guiderPop3, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(guiderPop3Page, {
      ev: ev
    });
  }

  doInfinite(infiniteScroll: any) {
    if (this.infiniteScrollEnd === false) {
      console.log('doInfinite, start is currently ' + this.start);
      this.start += 20;

      this.loadGuiders().then(data => {
        setTimeout(() => {
          console.log('Async operation has ended');
          infiniteScroll.complete();
          if (Object.keys(data).length == 0) {
            console.log("true")
            this.infiniteScrollEnd = true
          }
        }, 1000);
      });
    } else {
      infiniteScroll.complete();
    }
  }

      doRefresh(refresher) {
        console.log('Begin load', refresher);

        setTimeout(() => {
          console.log('Async loading has ended');
          this.guiders = []
          this.start = 0
          this.loadGuiders();

          refresher.complete();
        }, 1000);
      }
}
