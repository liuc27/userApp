import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, PopoverController } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';

import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { ProductPage } from '../pages/product/product';
import { GuiderPage } from '../pages/guider/guider';
import { SettingsPage } from '../pages/settings/settings';
import { SignUp } from '../pages/settings/signUp/signUp';
import { MyCoupons } from '../pages/settings/myCoupons/myCoupons';
import { MyFavorites } from '../pages/settings/myFavorites/myFavorites';
import { MyReservations } from '../pages/settings/myReservations/myReservations';
import { MyInformation } from '../pages/settings/myInformation/myInformation';
import { MyFriends } from '../pages/settings/myFriends/myFriends';

import { ProductLists } from '../pages/product/productLists/productLists';
import { ProductDetails } from '../pages/product/productLists/productDetails/productDetails';
import { Video } from '../pages/product/productLists/productDetails/video/video';
import { GuiderDetails } from '../pages/guider/guiderDetails/guiderDetails';
import { Reservation } from '../pages/guider/guiderDetails/reservation/reservation';
import { ReservationDetails } from '../pages/guider/guiderDetails/reservation/reservationDetails/reservationDetails';


import { guiderPop1 } from "../pages/guider/popoverPages/guiderPop1";
import { guiderPop2 } from "../pages/guider/popoverPages/guiderPop2";
import { guiderPop3 } from "../pages/guider/popoverPages/guiderPop3";

import { guiderDetailsPop1 } from "../pages/guider/guiderDetails/popoverPages/guiderDetailsPop1";
import { guiderDetailsPop2 } from "../pages/guider/guiderDetails/popoverPages/guiderDetailsPop2";
import { guiderDetailsPop3 } from "../pages/guider/guiderDetails/popoverPages/guiderDetailsPop3";

import { ProductListsPop1 } from "../pages/product/productLists/popoverPages/productListsPop1";
import { ProductListsPop2 } from "../pages/product/productLists/popoverPages/productListsPop2";
import { ProductListsPop3 } from "../pages/product/productLists/popoverPages/productListsPop3";
import { ModalContentPage } from "../pages/product/productLists/modalPages/modalContent";


import { ProductService } from '../pages/providers/product-getAllProducts-service/product-getAllProducts-service';
import { GuiderGetAllGuidersService } from '../pages/providers/guider-get-all-guiders-service/guider-get-all-guiders-service';
import { getSelectedProductDetails } from '../pages/providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';
import { CheckLogin } from '../providers/check-login'

import { Ionic2RatingModule } from 'ionic2-rating/module';
import { NgCalendarModule } from 'ionic2-calendar';


@NgModule({
  declarations: [
    MyApp,
    ProductPage,
    GuiderPage,
    SettingsPage,
    SignUp,
    MyCoupons,
    MyFriends,
    MyInformation,
    MyFavorites,
    MyReservations,
    TabsPage,
    ProductLists,
    ProductDetails,
    Video,
    GuiderDetails,
    Reservation,
    ReservationDetails,
    guiderPop1,
    guiderPop2,
    guiderPop3,
    guiderDetailsPop1,
    guiderDetailsPop2,
    guiderDetailsPop3,
    ProductListsPop1,
    ProductListsPop2,
    ProductListsPop3,
    ModalContentPage
  ],
  imports: [
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp, { tabsHideOnSubPages: "true" }),
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
    GuiderPage,
    SettingsPage,
    SignUp,
    MyCoupons,
    MyFriends,
    MyInformation,
    MyFavorites,
    MyReservations,
    TabsPage,
    ProductLists,
    ProductDetails,
    Video,
    GuiderDetails,
    Reservation,
    ReservationDetails,
    guiderPop1,
    guiderPop2,
    guiderPop3,
    guiderDetailsPop1,
    guiderDetailsPop2,
    guiderDetailsPop3,
    ProductListsPop1,
    ProductListsPop2,
    ProductListsPop3,
    ModalContentPage
  ],
  providers: [
    Storage,
    PopoverController,
    ProductService,
    GuiderGetAllGuidersService,
    getSelectedProductDetails,
    CheckLogin
  ]
})
export class AppModule { }

export function translateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
