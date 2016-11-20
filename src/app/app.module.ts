import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, PopoverController} from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';

import {HttpModule,Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import {ProductPage} from '../pages/product/product';
import {ShopPage} from '../pages/shop/shop';
import {SettingsPage} from '../pages/settings/settings';
import {ProductLists} from '../pages/product/productLists/productLists';
import {ProductDetails} from '../pages/product/productLists/productDetails/productDetails';
import {ShopDetails} from '../pages/shop/shopDetails/shopDetails';
import {ChatRoom} from '../pages/product/productLists/productDetails/chatRoom/chatRoom';
import {MorphPage} from '../pages/product/productLists/productDetails/morphPage/morphPage';


import {shopPop1} from "../pages/shop/popoverPages/shopPop1";
import {shopPop2} from "../pages/shop/popoverPages/shopPop2";
import {shopPop3} from "../pages/shop/popoverPages/shopPop3";

import {shopDetailsPop1} from "../pages/shop/shopDetails/popoverPages/shopDetailsPop1";
import {shopDetailsPop2} from "../pages/shop/shopDetails/popoverPages/shopDetailsPop2";
import {shopDetailsPop3} from "../pages/shop/shopDetails/popoverPages/shopDetailsPop3";

import {ProductListsPop1} from "../pages/product/productLists/popoverPages/productListsPop1";
import {ProductListsPop2} from "../pages/product/productLists/popoverPages/productListsPop2";
import {ProductListsPop3} from "../pages/product/productLists/popoverPages/productListsPop3";
import {ModalContentPage} from "../pages/product/productLists/modalPages/modalContent";


import {getSelectedProductLists} from '../pages/providers/productLists-GetSelectedProductLists-service/productLists-GetSelectedProductLists-service';
import {ProductService} from '../pages/providers/product-getAllProducts-service/product-getAllProducts-service';
import {ShopGetAllShopsService} from '../pages/providers/shop-get-all-shops-service/shop-get-all-shops-service';
import {getSelectedProductDetails} from '../pages/providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';

import { Ionic2RatingModule } from 'ionic2-rating/module';
import { NgCalendarModule  } from 'ionic2-calendar';


@NgModule({
  declarations: [
    MyApp,
    ProductPage,
    ShopPage,
    SettingsPage,
    TabsPage,
    ProductLists,
    ProductDetails,
    ShopDetails,
    ChatRoom,
    MorphPage,
    shopPop1,
    shopPop2,
    shopPop3,
    shopDetailsPop1,
    shopDetailsPop2,
    shopDetailsPop3,
    ProductListsPop1,
    ProductListsPop2,
    ProductListsPop3,
    ModalContentPage
  ],
  imports: [
    HttpModule,
     NgCalendarModule,
    IonicModule.forRoot(MyApp, {tabsHideOnSubPages:"true"}),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: translateLoaderFactory,
      deps: [Http]
    }),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProductPage,
    ShopPage,
    SettingsPage,
    TabsPage,
    ProductLists,
    ProductDetails,
    ShopDetails,
    ChatRoom,
    MorphPage,
    shopPop1,
    shopPop2,
    shopPop3,
    shopDetailsPop1,
    shopDetailsPop2,
    shopDetailsPop3,
    ProductListsPop1,
    ProductListsPop2,
    ProductListsPop3,
    ModalContentPage
  ],
  providers: [
    Storage,
    PopoverController,
    ProductService,
    getSelectedProductLists,
    ShopGetAllShopsService,
    getSelectedProductDetails
  ]
})
export class AppModule {}

export function translateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
