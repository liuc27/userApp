/**
 * Created by liuchao on 6/25/16.
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import {Events, NavController, NavParams, PopoverController} from 'ionic-angular';
import {shopDetailsPop1} from "./popoverPages/shopDetailsPop1";
import {shopDetailsPop2} from "./popoverPages/shopDetailsPop2";
import {shopDetailsPop3} from "./popoverPages/shopDetailsPop3";
import {getSelectedShopDetails} from '../../providers/shopDetails-GetSelectedShopDetails-service/shopDetails-GetSelectedShopDetails-service';
import {ProductDetails} from '../../product/productLists/productDetails/productDetails';
import {CheckLogin} from '../../../providers/check-login'
import {Storage} from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-shopDetails',
  templateUrl: 'shopDetails.html',
    providers:[getSelectedShopDetails,CheckLogin]
})
export class ShopDetails {
    @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
    @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;
    shop;
    productOrShop;
    shopDetails;
  alreadyLoggedIn = false;
  showCommentBox;
  comment;
  rate;
  validation = {
    username: undefined,
    password: undefined
  };

    constructor(private params: NavParams,
    private nav:NavController,
    private popover: PopoverController,
    private events: Events,
                public storage:Storage,
                public checkLogin:CheckLogin,
                private http:Http,
    public shopDetailsService:getSelectedShopDetails) {
      console.log("params.data is")
      console.log(params.data)
      this.shop = params.data;
      this.events = events;
      this.loadSelectedShopDetails(params.data);
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

    loadSelectedShopDetails(query) {
        this.shopDetailsService.load(query)
          .then(data => {
            console.log("shopDetails")
            console.log(data)
            this.shopDetails = data;
          })
    }

  alreadyLiked(product,validation) {
    if (validation.username == undefined) {
      return false
    } else if (product.likedBy.indexOf(validation.username) >= 0) {
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

  alreadyLikedCreator(shop,validation) {
    if (validation.username == undefined) {
      return false
    } else if (shop.likedBy.indexOf(validation.username) >= 0) {
      // console.log("posessed")
      // console.log(shop.likedBy.indexOf(validation.username))
      return true
    } else{
      //console.log("not exist")
      return false
    }
  }


  likeCreator(shop){
    if (this.validation.username == undefined) {
      alert("login before use,dude")
    }else{
      var likedCreator = {
        name: shop.name,
        username: this.validation.username,
        password: this.validation.password
      }
      console.log(shop.likedBy);

      this.http.post('http://localhost:8080/api/likeCreator',likedCreator)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          // alert(data);

          console.log(data)
          //var flag = data[_body]

          var flag = data.data
          if(flag=="push"){
            shop.likedBy.push(this.validation.username);
          }else if(flag=="pull"){

            var index = shop.likedBy.indexOf(this.validation.username);
            if (index > -1) {
              shop.likedBy.splice(index, 1);
            }
          }
          console.log(shop.likedBy);

        });
    }
  }

    presentShopDetailsPop1Popover(ev) {
        let shopDetailsPop1Page = this.popover.create(shopDetailsPop1, {
            contentEle: this.content.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentPopover");
        shopDetailsPop1Page.present({
            ev: ev
        });
    }

    presentShopDetailsPop2Popover(ev) {
        let shopDetailsPop2Page = this.popover.create(shopDetailsPop2, {
            contentEle: this.content.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentPopover");
        shopDetailsPop2Page.present({
            ev: ev
        });
    }

    presentShopDetailsPop3Popover(ev) {
        let shopDetailsPop3Page = this.popover.create(shopDetailsPop3, {
            contentEle: this.content.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentPopover");
        shopDetailsPop3Page.present({
            ev: ev
        });
    }

    openProductDetailsPage(product){
        console.log("detail open");
        this.nav.push(ProductDetails,{product:product});
    }

  sendComment(){
    console.log(this.shop)
    var commentData:any = {}
    var now = new Date()
    commentData.discussion_id = this.shop._id
    commentData.parent_id = null
    commentData.posted = now.toUTCString()
    commentData.username = this.validation.username
    commentData.password = this.validation.password
    commentData.text = this.comment
    commentData.rate = this.rate
    console.log(commentData)
    this.http.post('http://localhost:8080/api/addShopComment',commentData)
    //.map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        console.log(data)
        this.shop.comment.unshift(commentData);
        this.comment = null
        this.showCommentBox = !this.showCommentBox
      });
  }
}
