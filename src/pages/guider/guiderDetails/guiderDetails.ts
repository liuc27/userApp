/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { guiderDetailsPop1 } from "./popoverPages/guiderDetailsPop1";
import { guiderDetailsPop2 } from "./popoverPages/guiderDetailsPop2";
import { guiderDetailsPop3 } from "./popoverPages/guiderDetailsPop3";
import { ProductDetails } from '../../product/productLists/productDetails/productDetails';
import { CheckLogin } from '../../../providers/check-login'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProductService } from '../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { Reservation } from './reservation/reservation';
import moment from 'moment';
import { NgCalendarModule  } from 'ionic2-calendar';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-guiderDetails',
  templateUrl: 'guiderDetails.html',
  providers: [ProductService, CheckLogin]
})
export class GuiderDetails {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
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
    this.guider = params.data

    if(params.data!=undefined){
      if(params.data.from == "guiderPage"){
          this.guider = params.data;
          this.productService.load(this.start,null,params.data.guiderName).then(data2 => {
           this.guiderDetails = data2;
         })
      }else{
          this.loadSelectedGuiderDetails(params.data);
      }
    }
    this.popover = popover;

    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });

    this.serviceType = "guide"

    events.subscribe('guide', (data) => {
      console.log('Welcome');
      console.log(data)
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



  alreadyLikedGuider(guider) {
    if(this.validation == undefined){
      return false;
    }else {
    if (this.validation.username == undefined) {
      return false
    } else if (guider.likedBy.indexOf(this.validation.username) >= 0) {
      // console.log("posessed")
      // console.log(guider.likedBy.indexOf(validation.username))
      return true
    } else {
      //console.log("not exist")
      return false
    }
    }
  }


  likeGuider(guider) {
    if (this.validation.username == undefined) {
      alert("login before use,dude")
    } else {
      var likedGuider = {
        guiderName: guider.guiderName,
        username: this.validation.username,
        password: this.validation.password
      }
      console.log(guider.likedBy);

      this.http.post('http://localhost:8080/api/likeGuider', likedGuider)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          // alert(data);

          console.log(data)
          //var flag = data[_body]

          var flag = data.data
          if (flag == "push") {
            guider.likedBy.push(this.validation.username);
          } else if (flag == "pull") {

            var index = guider.likedBy.indexOf(this.validation.username);
            if (index > -1) {
              guider.likedBy.splice(index, 1);
            }
          }
          console.log(guider.likedBy);

        });
    }
  }

   alreadyLiked(product) {
         if(this.validation == undefined){
      return false;
    }else {
        if (this.validation.username == undefined) {
            return false
        } else if (product.likedBy.indexOf(this.validation.username) >= 0) {
            // console.log("posessed")
            // console.log(product.likedBy.indexOf(validation.username))
            return true
        } else {
            //console.log("not exist")
            return false
        }
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

            this.http.post('http://localhost:8080/api/likeProduct', likedProduct)
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


  presentGuiderDetailsPop1Popover(ev) {
    let guiderDetailsPop1Page = this.popover.create(guiderDetailsPop1, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    guiderDetailsPop1Page.present({
      ev: ev
    });
  }

  presentGuiderDetailsPop2Popover(ev) {
    let guiderDetailsPop2Page = this.popover.create(guiderDetailsPop2, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    guiderDetailsPop2Page.present({
      ev: ev
    });
  }

  presentGuiderDetailsPop3Popover(ev) {
    let guiderDetailsPop3Page = this.popover.create(guiderDetailsPop3, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    guiderDetailsPop3Page.present({
      ev: ev
    });
  }



  sendComment() {
    console.log(this.guider)
    var commentData: any = {}
    var now = new Date()
    if(this.guider._id)
    commentData.discussion_id = this.guider._id
    commentData.parent_id = null
    commentData.posted = now.toUTCString()
    if(this.validation.username)
    commentData.username = this.validation.username
    if(this.validation.password)
    commentData.password = this.validation.password
    if(this.comment)
    commentData.text = this.comment
    if(this.rate)
    commentData.rate = this.rate
    console.log(commentData)
    this.http.post('http://localhost:8080/api/addGuiderComment', commentData)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        console.log(data)
        if(data.data){
            if(data.data == "OK") this.guider.comment.unshift(commentData);
            else if(data.data == "NO") alert("Please sign in first !")
            this.comment = null
            this.showCommentBox = !this.showCommentBox
        }
      });
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

/*
loadEvents() {
  this.eventSource = this.createRandomEvents();
}

  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }



  onTimeSelected(ev) {


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
      o.log(daa)
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

      this.guideEventSourceISO.push({
        title: 'guideReservation',
        serviceType: 'guide',
        startTime: moment(startTime).format(),
        endTime: moment(endTime).format(),
        allDay: false,
        guiderName: this.guider.guiderName,
        username: this.validation.username
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
      serviceType: 'guide',
      startTime: startTime,
      endTime: endTime,
      allDay: false,
      guiderName: this.guider.guiderName,
      username: this.validation.username
    })
    this.eventSource = [].concat(this.chatEventSource);

    this.chatEventSourceISO.push({
      title: 'chatReservation',
      serviceType: 'guide',
      startTime: moment(startTime).format(),
      endTime: moment(endTime).format(),
      allDay: false,
      guiderName: this.guider.guiderName,
      username: this.validation.username
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

*/


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

  openProductDetailsPage(product) {
    console.log("detail open");
    this.nav.push(ProductDetails, { product: product });
  }

  doRefresh(refresher) {
    console.log('Begin load', refresher);

    setTimeout(() => {
      console.log('Async loading has ended');
      this.loadSelectedGuiderDetails(this.guider)

      refresher.complete();
    }, 1000);
  }
}
