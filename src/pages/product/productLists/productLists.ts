/**
 * Created by liuchao on 6/25/16.
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import { Events, NavController, NavParams, PopoverController, ModalController} from 'ionic-angular';
import {ProductListsPop1} from "./popoverPages/productListsPop1";
import {ProductListsPop2} from "./popoverPages/productListsPop2";
import {ProductListsPop3} from "./popoverPages/productListsPop3";
import {ProductDetails} from './productDetails/productDetails';
import {ShopDetails} from '../../shop/shopDetails/shopDetails';
import {ModalContentPage} from "./modalPages/modalContent";

import {getSelectedProductLists} from '../../providers/productLists-GetSelectedProductLists-service/productLists-GetSelectedProductLists-service';
import {CheckLogin} from '../../../providers/check-login'
import {Storage} from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-productLists',
  templateUrl: 'productLists.html',
    providers:[getSelectedProductLists,CheckLogin]
})
export class ProductLists {
    @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
    @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;
    shop;
    product;
    productOrShop;
    productLists;
    grid = [
      {},
      {},
    ];
    mySlideOptions = {
      autoplay: 3500,
      loop: true,
      speed: 450
    };
  alreadyLoggedIn = false;
  validation = {
    username: undefined,
    password: undefined
  };
  searchFilter = {
      pickUp: false,
      callSupport: false,
      student: false,
      male: false,
      female: false,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000 * 3).toISOString()
  }

    constructor(private params: NavParams,
    private nav:NavController,
    private popover: PopoverController,
    public modalCtrl: ModalController,
    private events: Events,
    private http:Http,
    public storage:Storage,
    public checkLogin:CheckLogin,
    public productListsService:getSelectedProductLists) {
        this.product = params.data.product;
        this.productOrShop = "product";
        console.log("params.data");
        this.loadSelectedProductLists();
        this.shop = params.data.product;
        this.popover = popover;
      this.checkLogin.load()
        .then(data => {
          this.validation = data
          this.alreadyLoggedIn = true;
        });
    }

    ionViewWillEnter() {
        // console.log("send hideTabs event")
        // this.events.publish('hideTabs');
    }

    openModal(characterNum) {

        let modal = this.modalCtrl.create(ModalContentPage, this.searchFilter);
        
        modal.onDidDismiss(data => {
          console.log(data);
          this.searchFilter = data;
        });
        modal.present();
    }

    loadSelectedProductLists() {
      this.productListsService.load(this.params)
          .then(data => {
            this.productLists = data;
            console.log("this.productLists");
          });
    }

    presentProductListsPop1Popover(ev) {
        let productListsPop1 = this.popover.create(ProductListsPop1, {
            contentEle: this.content.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentPopover1");
        productListsPop1.present({
            ev: ev
        });
    }

    presentProductListsPop2Popover(ev) {
        let productListsPop2 = this.popover.create(ProductListsPop2, {
            contentEle: this.content.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentPopover2");
        productListsPop2.present({
            ev: ev
        });
    }

    presentProductListsPop3Popover(ev) {
        let productListsPop3 = this.popover.create(ProductListsPop3, {
            contentEle: this.content.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentPopover3");
        productListsPop3.present({
            ev: ev
        });
    }

    openProductDetailsPage(product){
      console.log("detail open");
      this.nav.push(ProductDetails,{product:product});
    }


 alreadyLiked(product) {
    if (this.validation.username == undefined) {
      return false
    } else if (product.likedBy.indexOf(this.validation.username) >= 0) {
     // console.log("posessed")
      // console.log(product.likedBy.indexOf(validation.username))
      return true
    } else{
      //console.log("not exist")
      return false
    }
  }

  likeProduct(product){
    if (this.validation.username == undefined) {
      alert("login before use,dude")
    }else{
      var likedProduct = {
        name: product.name,
        username: this.validation.username,
        password: this.validation.password
      }
      console.log(product.likedBy);

      this.http.post('http://localhost:8080/api/likeProduct',likedProduct)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
         // alert(data);

          console.log(data)
          //var flag = data[_body]

          var flag = data.data
          if(flag=="push"){
            product.likedBy.push(this.validation.username);
          }else if(flag=="pull"){

            var index = product.likedBy.indexOf(this.validation.username);
            if (index > -1) {
              product.likedBy.splice(index, 1);
            }
          }
          console.log(product.likedBy);

        });
      }
  }

    openShopDetailsPage(product){
    this.http.post('http://localhost:8080/api/findCreator',product)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.nav.push(ShopDetails,data);

      });
  }

}
