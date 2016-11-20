/**
 * Created by liuchao on 6/25/16.
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import {Events, NavController, NavParams, PopoverController,} from 'ionic-angular';
import {shopPop1} from "./popoverPages/shopPop1";
import {shopPop2} from "./popoverPages/shopPop2";
import {shopPop3} from "./popoverPages/shopPop3";
import {ShopGetAllShopsService} from '../providers/shop-get-all-shops-service/shop-get-all-shops-service';
import {ShopDetails} from './shopDetails/shopDetails';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {CheckLogin} from '../../providers/check-login'
import {Storage} from '@ionic/storage'

@Component({
  selector:"page-Shop",
  templateUrl: 'shop.html',
  providers: [ShopGetAllShopsService,CheckLogin]
})
export class ShopPage {
  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;
  product;
  productOrShop;
  shop;
  shops;
  alreadyLoggedIn = false;
  validation = {
    username: undefined,
    password: undefined
  };

  constructor(private params: NavParams,
              private nav:NavController,
              private events: Events,
              private shopGetAllShopsService:ShopGetAllShopsService,
              public storage:Storage,
              public checkLogin:CheckLogin,
              public popoverCtrl:PopoverController,
              private http: Http) {
    this.events = events;
    this.product = params.data.product;
    this.productOrShop = "product";
    console.log(params.data);
    this.shop=params.data.shop;
    this.loadShops();
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

  loadShops(){
    this.shopGetAllShopsService.load()
      .then(data => {
        this.shops = data;
      })
  }

  openShopDetailsPage(shop){
    console.log("shop");
    console.log(shop);
    this.nav.push(ShopDetails,shop);
  }
  presentShopPop1Popover(ev) {
    let shopPop1Page = this.popoverCtrl.create(shopPop1, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(shopPop1Page, {
      ev: ev
    });
  }

  presentShopPop2Popover(ev) {
    let shopPop2Page = this.popoverCtrl.create(shopPop2, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(shopPop2Page, {
      ev: ev
    });
  }

  presentShopPop3Popover(ev) {
    let shopPop3Page = this.popoverCtrl.create(shopPop3, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(shopPop3Page, {
      ev: ev
    });
  }

}
