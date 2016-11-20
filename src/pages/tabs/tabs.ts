import {Component} from '@angular/core'
import {Events} from 'ionic-angular';
import {ProductPage} from '../product/product';
import {ShopPage} from '../shop/shop';
import {SettingsPage} from '../settings/settings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

   tab1Root: any;
   tab2Root: any;
   tab3Root: any;
  public show;
  public showTabs;

  constructor(private events: Events) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = ProductPage;
    this.tab2Root = ShopPage;
    this.tab3Root = SettingsPage;

    this.showTabs=true;
    this.listenToShowTabsEvents();
  }

  listenToShowTabsEvents() {
  this.events.subscribe('hideTabs', () => {
    this.showTabs = false;
  });

  this.events.subscribe('showTabs', () => {
    this.showTabs = true;
  });
}
}
