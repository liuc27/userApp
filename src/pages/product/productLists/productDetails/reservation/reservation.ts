/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams } from 'ionic-angular';
import { getSelectedProductDetails } from '../../../../providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';
import { ShopDetails } from '../../../../shop/shopDetails/shopDetails';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ProductService } from '../../../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { CheckLogin } from '../../../../../providers/check-login'

import moment from 'moment';
//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
    selector: 'page-reservation',
    templateUrl: 'reservation.html',
    providers: [getSelectedProductDetails, ProductService, CheckLogin]
})
export class Reservation {
    product;
    chatroomId;
    productOrShop;
    productDetails;
    alreadyLoggedIn = false;
    validation = {
        username: undefined,
        password: undefined
    };
    url: SafeResourceUrl;
    eventList = {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
    }
    guidePrice = 1000;
    chatPrice = 100;
    totalPrice = 0;
    eventSource: any;
    serviceType;

    constructor(private params: NavParams,
        private nav: NavController,
        private actionSheet: ActionSheetController,
        private events: Events,
        private sanitizer: DomSanitizer,
        public checkLogin: CheckLogin,
        public productDetailsService: getSelectedProductDetails,
        public chatroomService: ProductService) {
        this.eventSource = params.data.eventSource;
        this.checkLogin.load()
            .then(data => {
                this.validation = data
                this.alreadyLoggedIn = true;
            });

        if (this.eventSource) {
            for (var i = 0; i < this.eventSource.length; i++) {
                console.log(this.eventSource.length)
                if (this.eventSource[i].title && this.eventSource[i].startTime && this.eventSource[i].endTime) {
                    console.log(this.eventSource[i].title)
                    if (this.eventSource[i].title === "guideReservation") {
                        console.log("this is guide")
                        var duration = moment.duration(moment(this.eventSource[i].endTime).diff(moment(this.eventSource[i].startTime)));
                        var hours = duration.asHours();
                        var price = this.guidePrice * hours;
                        this.eventSource[i].price = price;
                        this.totalPrice += price;
                        this.serviceType = "guide"
                    } else if (this.eventSource[i].title === "chatReservation") {
                        console.log("this is chat")
                        var price = this.chatPrice * 10;
                        this.eventSource[i].price = price;
                        this.totalPrice += price;
                        this.serviceType = "chat"
                    }
                }
            }
        }

        console.log(this.eventSource);



        this.productOrShop = "product";
        console.log(params.data);
        this.loadSelectedproductDetails();
        this.actionSheet = actionSheet;
        this.url = sanitizer.bypassSecurityTrustResourceUrl('https://appear.in/charlie123456789');

    }

    cancellReservation(x) {
        console.log(x)
        for (var i = 0; i < this.eventSource.length; i++) {
            if (i === x) {
                if (this.eventSource[i].price) {
                    this.totalPrice -= this.eventSource[i].price
                }
                this.eventSource.splice(i, 1);

            }
        }
        console.log(this.eventSource)
    }

    recaculateTotal() {
        this.totalPrice = 0;
        if (this.eventSource) {
            for (var i = 0; i < this.eventSource.length; i++) {
                console.log(this.eventSource.length)
                if (this.eventSource[i].title && this.eventSource[i].startTime && this.eventSource[i].endTime) {
                    console.log(this.eventSource[i].title)
                    if (this.eventSource[i].title === "guideReservation") {
                        console.log("this is guide")
                        var duration = moment.duration(moment(this.eventSource[i].endTime).diff(moment(this.eventSource[i].startTime)));
                        var hours = duration.asHours();
                        var price = this.guidePrice * hours;
                        this.eventSource[i].price = price;
                        this.totalPrice += price;
                    } else if (this.eventSource[i].title === "chatReservation") {
                        console.log("this is chat")
                        var price = this.chatPrice * 10;
                        this.eventSource[i].price = price;
                        this.totalPrice += price;
                    }
                }
            }
        }
    }

    shareActionSheet() {
        let actionSheet = this.actionSheet.create({
            title: 'SHARE',
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Facebook',
                    icon: 'logo-facebook',
                    handler: () => {
                        console.log('Delete clicked');
                    }
                },
                {
                    text: 'email',
                    icon: 'ios-mail',
                    handler: () => {
                        console.log('Share clicked');
                    }
                },
                {
                    text: 'Wechat',
                    icon: 'arrow-dropright-circle',
                    handler: () => {
                        console.log('Play clicked');
                    }
                },
                {
                    text: 'Twitter',
                    icon: 'logo-twitter',
                    handler: () => {
                        console.log('Favorite clicked');
                    }
                },
                {
                    text: 'Google',
                    icon: 'logo-google',
                    handler: () => {
                        console.log('Favorite clicked');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: 'md-close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();

    }

    loadSelectedproductDetails() {
        this.productDetailsService.load()
            .then(data => {
                this.productDetails = data;
                console.log(this.productDetails);
            });
    }

    openShopDetailsPage(shop) {
        console.log("showShopDetails");
        console.log(shop);
        this.nav.push(ShopDetails, { shop: shop });
    }

    enterChatroom() {
        console.log("enterChatroom");
        this.chatroomService.load()
            .then(data => {
                this.chatroomId = data;
                if (data) {
                    console.log(data);
                    console.log("chatroomServiceConnecting");
                }
            });
    }

    openOauth(x) {
        console.log(x)
    }


    ionViewWillLeave() {
        if (this.serviceType == "guide") {
            this.events.publish('guide', this.eventSource);
        } else {
            this.events.publish("chat", this.eventSource);
        }
    }

}
