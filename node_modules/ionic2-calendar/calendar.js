import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarService } from './calendar.service';
export var Step;
(function (Step) {
    Step[Step["QuarterHour"] = 15] = "QuarterHour";
    Step[Step["HalfHour"] = 30] = "HalfHour";
    Step[Step["Hour"] = 60] = "Hour";
})(Step || (Step = {}));
export var CalendarComponent = (function () {
    function CalendarComponent(calendarService) {
        this.calendarService = calendarService;
        this.eventSource = [];
        this.calendarMode = 'month';
        this.formatDay = 'd';
        this.formatDayHeader = 'EEE';
        this.formatDayTitle = 'MMMM dd, yyyy';
        this.formatWeekTitle = 'MMMM yyyy, Week $n';
        this.formatMonthTitle = 'MMMM yyyy';
        this.formatWeekViewDayHeader = 'EEE d';
        this.formatHourColumn = 'ha';
        this.showEventDetail = true;
        this.startingDayMonth = 0;
        this.startingDayWeek = 0;
        this.allDayLabel = 'all day';
        this.noEventsLabel = 'No Events';
        this.queryMode = 'local';
        this.step = Step.Hour;
        this.onCurrentDateChanged = new EventEmitter();
        this.onRangeChanged = new EventEmitter();
        this.onEventSelected = new EventEmitter();
        this.onTimeSelected = new EventEmitter();
        this.onTitleChanged = new EventEmitter();
        this.hourParts = 1;
    }
    Object.defineProperty(CalendarComponent.prototype, "currentDate", {
        get: function () {
            return this._currentDate;
        },
        set: function (val) {
            this._currentDate = val;
            this.calendarService.currentDate = this.currentDate;
        },
        enumerable: true,
        configurable: true
    });
    CalendarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.hourParts = 60 / this.step;
        this.calendarService.queryMode = this.queryMode;
        this.calendarService.currentDateChanged$.subscribe(function (currentDate) {
            _this._currentDate = currentDate;
            _this.onCurrentDateChanged.emit(currentDate);
        });
    };
    CalendarComponent.prototype.rangeChanged = function (range) {
        this.onRangeChanged.emit(range);
    };
    CalendarComponent.prototype.eventSelected = function (event) {
        this.onEventSelected.emit(event);
    };
    CalendarComponent.prototype.timeSelected = function (timeSelected) {
        this.onTimeSelected.emit(timeSelected);
    };
    CalendarComponent.prototype.titleChanged = function (title) {
        this.onTitleChanged.emit(title);
    };
    CalendarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'calendar',
                    template: "\n        <div [ngSwitch]=\"calendarMode\">\n            <monthview *ngSwitchCase=\"'month'\"\n                [formatDay]=\"formatDay\"\n                [formatDayHeader]=\"formatDayHeader\"\n                [formatMonthTitle]=\"formatMonthTitle\"\n                [startingDayMonth]=\"startingDayMonth\"\n                [showEventDetail]=\"showEventDetail\"\n                [noEventsLabel]=\"noEventsLabel\"\n                [eventSource]=\"eventSource\"\n                (onRangeChanged)=\"rangeChanged($event)\"\n                (onEventSelected)=\"eventSelected($event)\"\n                (onTimeSelected)=\"timeSelected($event)\"\n                (onTitleChanged)=\"titleChanged($event)\">\n            </monthview>\n            <weekview *ngSwitchCase=\"'week'\"\n                [formatWeekTitle]=\"formatWeekTitle\"\n                [formatWeekViewDayHeader]=\"formatWeekViewDayHeader\"\n                [formatHourColumn]=\"formatHourColumn\"\n                [startingDayWeek]=\"startingDayWeek\"\n                [allDayLabel]=\"allDayLabel\"\n                [hourParts]=\"hourParts\"\n                [eventSource]=\"eventSource\"\n                (onRangeChanged)=\"rangeChanged($event)\"\n                (onEventSelected)=\"eventSelected($event)\"\n                (onTimeSelected)=\"timeSelected($event)\"\n                (onTitleChanged)=\"titleChanged($event)\">\n            </weekview>\n            <dayview *ngSwitchCase=\"'day'\"\n                [formatDayTitle]=\"formatDayTitle\"\n                [formatHourColumn]=\"formatHourColumn\"\n                [allDayLabel]=\"allDayLabel\"\n                [hourParts]=\"hourParts\"\n                [eventSource]=\"eventSource\"\n                (onRangeChanged)=\"rangeChanged($event)\"\n                (onEventSelected)=\"eventSelected($event)\"\n                (onTimeSelected)=\"timeSelected($event)\"\n                (onTitleChanged)=\"titleChanged($event)\">\n            </dayview>\n        </div>\n    ",
                    styles: ["\n        :host > div { height: 100%; }\n    "],
                    providers: [CalendarService]
                },] },
    ];
    CalendarComponent.ctorParameters = [
        { type: CalendarService, },
    ];
    CalendarComponent.propDecorators = {
        'currentDate': [{ type: Input },],
        'eventSource': [{ type: Input },],
        'calendarMode': [{ type: Input },],
        'formatDay': [{ type: Input },],
        'formatDayHeader': [{ type: Input },],
        'formatDayTitle': [{ type: Input },],
        'formatWeekTitle': [{ type: Input },],
        'formatMonthTitle': [{ type: Input },],
        'formatWeekViewDayHeader': [{ type: Input },],
        'formatHourColumn': [{ type: Input },],
        'showEventDetail': [{ type: Input },],
        'startingDayMonth': [{ type: Input },],
        'startingDayWeek': [{ type: Input },],
        'allDayLabel': [{ type: Input },],
        'noEventsLabel': [{ type: Input },],
        'queryMode': [{ type: Input },],
        'step': [{ type: Input },],
        'onCurrentDateChanged': [{ type: Output },],
        'onRangeChanged': [{ type: Output },],
        'onEventSelected': [{ type: Output },],
        'onTimeSelected': [{ type: Output },],
        'onTitleChanged': [{ type: Output },],
    };
    return CalendarComponent;
}());
//# sourceMappingURL=calendar.js.map