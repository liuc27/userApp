/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams } from 'ionic-angular';
import { getSelectedProductDetails } from '../../../../providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';
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
    selector: 'page-reservationDetails',
    templateUrl: 'reservationDetails.html',
    providers: [getSelectedProductDetails, ProductService, CheckLogin]
})
export class ReservationDetails {
    product;
    chatroomId;
    productOrGuider;
    productDetails;
    alreadyLoggedIn = false;
    validation : any = {};
    url: SafeResourceUrl;
    eventList = {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
    }
    guidePrice = 1000;
    chatPrice = 100;
    totalPrice = 0;
    eventSourceISO: any;
    serviceType;

    constructor(private params: NavParams,
        private nav: NavController,
        private actionSheet: ActionSheetController,
        private events: Events,
        private sanitizer: DomSanitizer,
        public checkLogin: CheckLogin,
        public productDetailsService: getSelectedProductDetails,
        public chatroomService: ProductService) {
        this.eventSourceISO = params.data.eventSource;
        this.eventSourceISO.forEach((element, index) => {
          element.startTime = moment(element.startTime).format()
          element.endTime = moment(element.endTime).format()
        });
        this.checkLogin.load()
            .then(data => {
                this.validation = data
                this.alreadyLoggedIn = true;
            });

        if (this.eventSourceISO) {
            for (var i = 0; i < this.eventSourceISO.length; i++) {
                console.log(this.eventSourceISO.length)
                if (this.eventSourceISO[i].serviceType && this.eventSourceISO[i].startTime && this.eventSourceISO[i].endTime) {
                    console.log(this.eventSourceISO[i].serviceType)
                    if (this.eventSourceISO[i].serviceType === "guide") {
                        console.log("this is guide")
                        var duration = moment.duration(moment(this.eventSourceISO[i].endTime).diff(moment(this.eventSourceISO[i].startTime)));
                        var hours = duration.asHours();
                        var price = this.guidePrice * hours;
                        this.eventSourceISO[i].price = price;
                        this.totalPrice += price;
                        this.serviceType = "guide"
                    } else if (this.eventSourceISO[i].serviceType === "chat") {
                        console.log("this is chat")
                        var price = this.chatPrice * 10;
                        this.eventSourceISO[i].price = price;
                        this.totalPrice += price;
                        this.serviceType = "chat"
                    }
                }
            }
        }

        console.log(this.eventSourceISO);



        this.productOrGuider = "product";
        console.log(params.data);
        this.loadSelectedproductDetails();
        this.actionSheet = actionSheet;
        this.url = sanitizer.bypassSecurityTrustResourceUrl('https://appear.in/charlie123456789');

    }

    addReservation(x) {
        console.log(x)
        for (var i = 0; i < this.eventSourceISO.length; i++) {
            if (i === x) {
                this.eventSourceISO.push({
                  title: this.eventSourceISO[i].title,
                  serviceType: this.eventSourceISO[i].serviceType,
                  startTime: this.eventSourceISO[i].endTime,
                  endTime: this.eventSourceISO[i].endTime,
                  allDay: this.eventSourceISO[i].allDay,
                  guiderName: this.eventSourceISO[i].guiderName,
                  username: this.eventSourceISO[i].username
                }
              );
            }
        }
        console.log(this.eventSourceISO)
    }

    cancellReservation(x) {
        console.log(x)
        for (var i = 0; i < this.eventSourceISO.length; i++) {
            if (i === x) {
                if (this.eventSourceISO[i].price) {
                    this.totalPrice -= this.eventSourceISO[i].price
                }
                this.eventSourceISO.splice(i, 1);

            }
        }
        console.log(this.eventSourceISO)
    }

    recaculateTotal() {
        this.totalPrice = 0;
        if (this.eventSourceISO) {
            for (var i = 0; i < this.eventSourceISO.length; i++) {
                console.log(this.eventSourceISO.length)
                if (this.eventSourceISO[i].serviceType && this.eventSourceISO[i].startTime && this.eventSourceISO[i].endTime) {
                    console.log(this.eventSourceISO[i].serviceType)
                    if (this.eventSourceISO[i].serviceType === "guide") {
                        console.log("this is guide")
                        var duration = moment.duration(moment(this.eventSourceISO[i].endTime).diff(moment(this.eventSourceISO[i].startTime)));
                        var hours = duration.asHours();
                        var price = this.guidePrice * hours;
                        this.eventSourceISO[i].price = price;
                        this.totalPrice += price;
                    } else if (this.eventSourceISO[i].serviceType === "chat") {
                        console.log("this is chat")
                        var price = this.chatPrice * 10;
                        this.eventSourceISO[i].price = price;
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
      /*  this.productDetailsService.load()
            .then(data => {
                this.productDetails = data;
                console.log(this.productDetails);
            }); */
    }

    openOauth(x) {
        console.log(x)
        alert("will soon add this function")
    }


    ionViewWillLeave() {
        if (this.serviceType == "guide") {
            this.events.publish('guide', this.eventSourceISO);
        } else if(this.serviceType =="chat"){
            this.events.publish("chat", this.eventSourceISO);
        }
    }

}
