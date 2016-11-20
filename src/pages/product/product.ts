import {Component} from '@angular/core';
import {Platform, Events, ActionSheetController, NavController} from 'ionic-angular';
import {ProductService} from '../providers/product-getAllProducts-service/product-getAllProducts-service';
import {ProductLists} from './productLists/productLists';
import {ProductDetails} from './productLists/productDetails/productDetails';
import {ShopDetails} from '../shop/shopDetails/shopDetails';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {CheckLogin} from '../../providers/check-login'
import {Storage} from '@ionic/storage'


@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
  providers:[ProductService,CheckLogin]
})
export class ProductPage {
  public products:any;
  public product:any;
  public menu1:any = [];
  public menu2:any = [];
  public menu3 = [];
  public menu4 = [];
  public grid = [];
  point;
  alreadyLoggedIn = false;
  validation = {
    username: undefined,
    password: undefined
  };

  constructor(private nav:NavController,
              private actionSheet:ActionSheetController,
              public productService:ProductService,
              private events:Events,
              public platform:Platform,
              public storage:Storage,
              public checkLogin:CheckLogin,
              private http: Http) {
    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
    this.loadProducts();
    this.actionSheet=actionSheet;

    this.getMenu();
  }

  ionViewWillEnter() {
    console.log("send showTabs event")
    this.events.publish('showTabs');
  }

  loadProducts() {
    this.productService.load()
        .then(data => {
          this.products = data;
        });
  }

  getMenu(){
      this.http.get('http://localhost:8080/api/getMenu')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
         // alert(data);
          console.log("menu is")
          console.log(data)
          //var flag = data[_body]

          if(data.length>9){
            for(var i=0;i<5;i++){
              this.menu1.push(data[i])
              this.menu3.push(data[i])
            }
            for(var i=5;i<10;i++){
              this.menu2.push(data[i])
              this.menu4.push(data[i])
            }

            this.grid.push(this.menu1);
            this.grid.push(this.menu2);
          }
          })
    }
  
  
  openMenu() {
    let actionSheet = this.actionSheet.create({
      title: 'Albums',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Play',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Favorite',
          icon: !this.platform.is('ios') ? 'heart-outline' : null,
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

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

  openProductListsPage(product){
    this.nav.push(ProductLists,{product:product});
  }

  openProductDetailsPage(product){
    console.log("detail clicked");
    this.nav.push(ProductDetails,{product:product});
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
