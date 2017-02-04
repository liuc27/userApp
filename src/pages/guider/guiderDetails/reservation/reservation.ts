/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ProductDetails } from '../../../product/productLists/productDetails/productDetails';
import { CheckLogin } from '../../../../providers/check-login'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProductService } from '../../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { ReservationDetails } from './reservationDetails/reservationDetails';
import moment from 'moment';

import { NgCalendarModule  } from 'ionic2-calendar';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
  providers: [ProductService, CheckLogin]
})
export class Reservation {
  guider : any = {
    comment:[],
    likedBy:[]
  };
  guiderDetails : any = [];
  alreadyLoggedIn = false;
  showCommentBox;
  comment;
  rate;
  validation : any = {};

  eventSource = [];
  chatEventSource = [];
  guideEventSource = [];
  viewTitle;

  isToday: boolean;
  calendar = {
    mode: 'week',
    currentDate: new Date()
  };

  serviceType;
  start = 0


  //    reservationId;

  constructor(private params: NavParams,
    private nav: NavController,
    private popover: PopoverController,
    private events: Events,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http,
    public productService: ProductService,
    public reservationService: ProductService,
    public alertCtrl: AlertController) {
    console.log("params.data is")
    console.log(params.data)
    this.events = events;

    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
    if(!this.serviceType){
      this.serviceType = "guide"
    }
    events.subscribe('guide', (data) => {
      console.log('Welcome');
      this.guideEventSource = []

      data.forEach((element, index) => {
        this.guideEventSource.push({
          title: 'guideReservation',
          serviceType: 'guide',
          startTime: new Date(element.startTime),
          endTime: new Date(element.endTime),
          allDay: false,
          guiderName: this.guider.guiderName,
          username: this.validation.username
        })
      });
      this.eventSource = this.guideEventSource

    });

    events.subscribe('chat', (data) => {
      console.log('chat');
      this.chatEventSource = []

      data.forEach((element, index) => {
        this.chatEventSource.push({
          title: 'chatReservation',
          serviceType: 'chat',
          startTime: new Date(element.startTime),
          endTime: new Date(element.endTime),
          allDay: false,
          guiderName: this.guider.guiderName,
          username: this.validation.username
        })
      });

      this.eventSource = this.chatEventSource

    });

  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    // this.events.publish('hideTabs');
  }

  loadSelectedGuiderDetails(paramsData) {


  return new Promise(resolve => {
      this.productService.load(this.start,null,paramsData.guiderName)
      .then(data => {
        console.log("data")
        console.log(data)
        if(Object.keys(data).length==0){
          this.start-=20
        }
          if(this.guiderDetails.product){
          this.guiderDetails = this.guiderDetails.concat(data);
          }else {
          this.guiderDetails = [].concat(data);
          }
        resolve(data);
      });
    });
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
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



  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
    console.log(ev);
    console.log("sesesese")

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
      var theIndex;

      for (var i = 0; i < this.guideEventSource.length && alertType == 0; i++) {
        if (ev.selectedTime.getTime() == this.guideEventSource[i].startTime.getTime()) {
          alertType = 1;
          theIndex = i
        }
      }


      if (alertType === 0) {
        let confirm = this.alertCtrl.create({
          title: 'Make reservation?',
          message: 'How many hours do you need?',
          buttons: [
            {
              text: '3 hours',
              handler: () => {
                this.createEvents(ev, 3)
              }
            },
            {
              text: '5 hours',
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
      } else if (this.guideEventSource[theIndex].username === this.validation.username) {
        let confirm = this.alertCtrl.create({
          title: 'Make reservation?',
          message: 'How many hours do you need?',
          buttons: [
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
      } else {

        console.log("ev")
        console.log(ev)
        console.log(this.validation.username)
        console.log(this.guideEventSource)
        console.log(this.guideEventSource[theIndex].username)
        let confirm2 = this.alertCtrl.create({
          title: 'Make reservation?',
          message: 'How many hours do you need?',
          buttons: [
            {
              text: 'time is alaready reservated by other users',
              handler: () => {

              }
            }
          ]
        });
        confirm2.present();
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
        serviceType: 'guide',
        startTime: startTime,
        endTime: endTime,
        allDay: false,
        guiderName: this.guider.guiderName,
        username: this.validation.username
      })
      this.eventSource = [].concat(this.guideEventSource);

      this.guideEventSource = this.eventSource;
    }
  }

  createCallReservation(ev, option: String) {
    var date = ev.selectedTime;
    var startTime, endTime;
    if (option === "dayTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() + 8);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 20);
    } else if (option === "nightTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() + 20);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 30);
    } else if (option === "fullTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() + 0);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 24);
    }


    // endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
    this.chatEventSource.push({
      title: 'chatReservation',
      serviceType: 'chat',
      startTime: startTime,
      endTime: endTime,
      allDay: false,
      guiderName: this.guider.guiderName,
      username: this.validation.username
    })
    this.eventSource = [].concat(this.chatEventSource);
    this.chatEventSource = this.eventSource;
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
          allDay: true,
          guiderName: this.guider.guiderName,
          username: this.validation.username
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
          allDay: false,
          guiderName: this.guider.guiderName,
          username: this.validation.username
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
    console.log("chat")
    this.eventSource = this.chatEventSource
    this.calendar.mode = "month"
    this.serviceType = "chat"
  }

  selectedGuide() {
    this.eventSource = this.guideEventSource
    this.calendar.mode = "week"
    this.serviceType = "guide"
  }

  enterReservationDetails() {
    this.nav.push(ReservationDetails, { eventSource: this.eventSource});
  }
}
