import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { MonthViewComponent } from './monthview';
import { WeekViewComponent } from './weekview';
import { DayViewComponent } from './dayview';
import { CalendarComponent } from './calendar';
export var NgCalendarModule = (function () {
    function NgCalendarModule() {
    }
    NgCalendarModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        MonthViewComponent, WeekViewComponent, DayViewComponent, CalendarComponent
                    ],
                    imports: [IonicModule],
                    exports: [CalendarComponent],
                    entryComponents: [CalendarComponent]
                },] },
    ];
    NgCalendarModule.ctorParameters = [];
    return NgCalendarModule;
}());
//# sourceMappingURL=calendar.module.js.map