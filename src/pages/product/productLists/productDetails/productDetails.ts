/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { getSelectedProductDetails } from '../../../providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';
import { ShopDetails } from '../../../shop/shopDetails/shopDetails';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ProductService } from '../../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { Reservation } from './reservation/reservation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CheckLogin } from '../../../../providers/check-login'
import { Storage } from '@ionic/storage'
import { Ionic2RatingModule } from 'ionic2-rating';

import moment from 'moment';
//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';


@Component({
    selector: 'page-productDetails',
    templateUrl: 'productDetails.html',
    providers: [getSelectedProductDetails, ProductService, CheckLogin]
})
export class ProductDetails {
    @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
    @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
    product;
    reservationId;
    productOrShop;
    productDetails;
    url: SafeResourceUrl;
    rate = 4;
    comment;
    showCommentBox = false;
    alreadyLoggedIn = false;
    validation = {
        username: undefined,
        password: undefined
    };

    eventSource = [];
    chatEventSource = [];
    guideEventSource = [];
    eventSourceISO = [];
    chatEventSourceISO = [];
    guideEventSourceISO = [];
    viewTitle;

    isToday: boolean;
    calendar = {
        mode: 'week',
        currentDate: new Date()
    };

    serviceType;


    constructor(private params: NavParams,
        private nav: NavController,
        sanitizer: DomSanitizer,
        private actionSheet: ActionSheetController,
        private events: Events,
        public productDetailsService: getSelectedProductDetails,
        public reservationService: ProductService,
        public productService: ProductService,
        public storage: Storage,
        public checkLogin: CheckLogin,
        private http: Http,
        public alertCtrl: AlertController) {
        this.product = params.data.product;
        this.productOrShop = "product";
        console.log("params.data got");
        this.loadSelectedproductDetails();
        this.actionSheet = actionSheet;
        this.serviceType = "guide"
        this.checkLogin.load().then(data => {
            this.validation = data
            this.alreadyLoggedIn = true;
        });

        events.subscribe('guide', (data) => {
            console.log('Welcome');
            this.guideEventSource = []

            data[0].forEach((element, index) => {
                this.guideEventSource.push({
                    title: 'guideReservation',
                    startTime: new Date(element.startTime),
                    endTime: new Date(element.endTime),
                    allDay: false
                })
            });
            this.eventSource = this.guideEventSource
        });

        events.subscribe('chat', (data) => {
            console.log('chat');
            this.chatEventSource = []

            data[0].forEach((element, index) => {
                this.chatEventSource.push({
                    title: 'chatReservation',
                    startTime: new Date(element.startTime),
                    endTime: new Date(element.endTime),
                    allDay: false
                })
            });
            this.eventSource = this.chatEventSource
        });

        this.url = sanitizer.bypassSecurityTrustResourceUrl(this.product.videoURL + '?rel=0&modestbranding=1&autohide=1&showinfo=0&');
    }

    ionViewWillEnter() {
        // console.log("send hideTabs event")
        //   this.events.publish('hideTabs');


    }

    shareActionSheet() {

        var k = moment(new Date().toISOString()).tz('Asia/Shanghai').locale('').format('LLL');
        console.log(k);
        console.log(this.rate)
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
                    text: 'Email',
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
                console.log("this.productDetails");
            });
    }

    alreadyLiked(product, validation) {
        if (validation.username == undefined) {
            return false
        } else if (product.likedBy.indexOf(validation.username) >= 0) {
            // console.log("posessed")
            // console.log(product.likedBy.indexOf(validation.username))
            return true
        } else {
            //console.log("not exist")
            return false
        }
    }

    likeProduct(product) {
        if (this.validation.username == undefined) {
            alert("login before use,dude")
        } else {
            var likedProduct = {
                name: product.name,
                username: this.validation.username,
                password: this.validation.password
            }
            console.log(product.likedBy);

            this.http.post('http://120.24.168.7:8080/api/likeProduct', likedProduct)
                .map(res => res.json())
                .subscribe(data => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    // alert(data);

                    console.log(data)
                    //var flag = data[_body]

                    var flag = data.data
                    if (flag == "push") {
                        product.likedBy.push(this.validation.username);
                    } else if (flag == "pull") {

                        var index = product.likedBy.indexOf(this.validation.username);
                        if (index > -1) {
                            product.likedBy.splice(index, 1);
                        }
                    }
                    console.log(product.likedBy);

                });
        }
    }

    openShopDetailsPage(product) {
        console.log(product)
        this.http.post('http://120.24.168.7:8080/api/findCreator', product)
            .map(res => res.json())
            .subscribe(data => {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                this.nav.push(ShopDetails, data);

            });
    }

    purchaseProduct() {
        window.open("http://" + this.product.link, "_system");
    }

    sendComment() {
        console.log(this.product)
        var commentData: any = {}
        var now = new Date()
        commentData.discussion_id = this.product._id
        commentData.parent_id = null
        commentData.posted = now.toUTCString()
        commentData.username = this.validation.username
        commentData.password = this.validation.password
        commentData.text = this.comment
        commentData.rate = this.rate
        console.log(commentData)
        this.http.post('http://120.24.168.7:8080/api/addProductComment', commentData)
            //.map(res => res.json())
            .subscribe(data => {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                console.log(data)
                this.product.comment.unshift(commentData);
                this.comment = null
                this.showCommentBox = !this.showCommentBox
            });
    }


    loadEvents() {
        this.eventSource = this.createRandomEvents();
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
        console.log(ev);

        if (this.calendar.mode == "month" && this.serviceType == "guide") {
            let confirm1 = this.alertCtrl.create({
                title: 'Make reservation?',
                message: 'How many hours do you need?',
                buttons: [
                    {
                        text: 'choose specified hours',
                        handler: () => {
                            this.calendar.mode = "week"
                        }
                    },
                    {
                        text: 'cancell',
                        handler: () => {

                        }
                    }
                ]
            });
            confirm1.present();

        } else if (this.calendar.mode == "month" && this.serviceType == "chat") {
            let confirm2 = this.alertCtrl.create({
                title: 'Make chat reservation?',
                message: '1 hour support for any time in a day',
                buttons: [
                    {
                        text: '8AM~10PM support',
                        handler: () => {
                            this.createCallReservation(ev, "dayTime")
                        }
                    }, {
                        text: '10PM~8AM support',
                        handler: () => {
                            this.createCallReservation(ev, "nightTime")
                        }
                    }, {
                        text: '24hour support',
                        handler: () => {
                            this.createCallReservation(ev, "fullTime")
                        }
                    },

                    {
                        text: 'cancell',
                        handler: () => {

                        }
                    }
                ]
            });
            confirm2.present();
        } else if (this.calendar.mode == "week" && this.serviceType == "guide") {
            var alertType = 0;
            for (var i = 0; i < this.guideEventSource.length && alertType == 0; i++) {
                if (ev.selectedTime.getTime() == this.guideEventSource[i].startTime.getTime()) {
                    alertType = 1;
                }
            }


            if (alertType === 0) {
                let confirm = this.alertCtrl.create({
                    title: 'Make reservation?',
                    message: 'How many hours do you need?',
                    buttons: [
                        {
                            text: '3 hour',
                            handler: () => {
                                this.createEvents(ev, 3)
                            }
                        },
                        {
                            text: '5 hour',
                            handler: () => {
                                this.createEvents(ev, 5)
                            }
                        },
                        {
                            text: 'cancell',
                            handler: () => {

                            }
                        }
                    ]
                });
                confirm.present();
            } else {
                let confirm = this.alertCtrl.create({
                    title: 'Make reservation?',
                    message: 'How many hours do you need?',
                    buttons: [
                        {
                            text: '3 hour',
                            handler: () => {
                                this.createEvents(ev, 3)
                            }
                        },
                        {
                            text: '5 hour',
                            handler: () => {
                                this.createEvents(ev, 5)
                            }
                        },
                        {
                            text: 'delete',
                            handler: () => {
                                this.createEvents(ev, 999)
                            }
                        },
                        {
                            text: 'cancell',
                            handler: () => {

                            }
                        }
                    ]
                });
                confirm.present();

            }
        }

    }

    createEvents(ev, h: Number) {
        if (h == 999) {
            this.guideEventSource.forEach((elementEvent, index) => {
                console.log(elementEvent.startTime.getTime())
                console.log(ev.selectedTime.getTime())
                if (ev.selectedTime.getTime() == elementEvent.startTime.getTime()) {
                    console.log(index)
                    this.guideEventSourceISO.splice(index, 1);
                    this.guideEventSource.splice(index, 1);
                    this.eventSource = [].concat(this.guideEventSource);

                    console.log(this.eventSource)
                }
            });
        } else if (h > 24) {

        } else {
            var date = ev.selectedTime;
            var startTime, endTime;
            startTime = new Date(ev.selectedTime.getTime());
            startTime.setHours(startTime.getHours());
            endTime = new Date(ev.selectedTime.getTime());
            endTime.setHours(endTime.getHours() + h);
            this.guideEventSource.push({
                title: 'guideReservation',
                startTime: startTime,
                endTime: endTime,
                allDay: false
            })
            this.eventSource = [].concat(this.guideEventSource);

            this.guideEventSourceISO.push({
                title: 'guideReservation',
                startTime: moment(startTime).format(),
                endTime: moment(endTime).format(),
                allDay: false
            })
            this.eventSourceISO = [].concat(this.guideEventSourceISO);

            this.guideEventSource = this.eventSource;
            this.guideEventSourceISO = this.eventSourceISO
        }
    }

    createCallReservation(ev, option: String) {
        var date = ev.selectedTime;
        var startTime, endTime;
        if (option === "dayTime") {
            startTime = new Date(ev.selectedTime.getTime());
            startTime.setHours(startTime.getHours() - 4);
            // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
            endTime = new Date(ev.selectedTime.getTime());
            endTime.setHours(endTime.getHours() + 10);
        } else if (option === "nightTime") {
            startTime = new Date(ev.selectedTime.getTime());
            startTime.setHours(startTime.getHours() + 10);
            // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
            endTime = new Date(ev.selectedTime.getTime());
            endTime.setHours(endTime.getHours() + 20);
        } else if (option === "fullTime") {
            startTime = new Date(ev.selectedTime.getTime());
            startTime.setHours(startTime.getHours() - 4);
            // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
            endTime = new Date(ev.selectedTime.getTime());
            endTime.setHours(endTime.getHours() + 20);
        }


        // endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
        this.chatEventSource.push({
            title: 'chatReservation',
            startTime: startTime,
            endTime: endTime,
            allDay: false
        })
        this.eventSource = [].concat(this.chatEventSource);

        this.chatEventSourceISO.push({
            title: 'chatReservation',
            startTime: moment(startTime).format(),
            endTime: moment(endTime).format(),
            allDay: false
        })



        this.eventSourceISO = [].concat(this.chatEventSourceISO);

        this.chatEventSource = this.eventSource;
        this.chatEventSourceISO = this.eventSourceISO
    }

    onCurrentDateChanged(event: Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    createRandomEvents() {
        var events = [];
        for (var i = 0; i < 50; i += 1) {
            var date = new Date();
            var eventType = Math.floor(Math.random() * 2);
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            if (eventType === 0) {
                startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                events.push({
                    title: 'All Day - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true
                });
            } else {
                var startMinute = Math.floor(Math.random() * 24 * 60);
                var endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                events.push({
                    title: 'Event - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false
                });
            }
        }
        console.log(events)
        return events;
    }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    selectedChat() {
        this.eventSource = this.chatEventSource
        this.eventSourceISO = this.chatEventSourceISO
        this.calendar.mode = "month"
        this.serviceType = "chat"
    }

    selectedGuide() {
        this.eventSource = this.guideEventSource
        this.eventSourceISO = this.guideEventSourceISO
        this.calendar.mode = "week"
        this.serviceType = "guide"
    }

    enterReservation() {
        this.nav.push(Reservation, { eventSource: this.eventSourceISO });
    }
}
