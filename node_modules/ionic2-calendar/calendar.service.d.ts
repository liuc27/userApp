import { Observable } from 'rxjs/Rx';
import { ICalendarComponent, CalendarMode, QueryMode } from './calendar';
export declare class CalendarService {
    queryMode: QueryMode;
    currentDateChanged$: Observable<Date>;
    private _currentDate;
    private currentDateChanged;
    constructor();
    setCurrentDateWithoutEvent(val: Date): void;
    currentDate: Date;
    rangeChanged(component: ICalendarComponent): void;
    private getStep(mode);
    getAdjacentCalendarDate(mode: CalendarMode, direction: number): Date;
    getAdjacentViewStartTime(component: ICalendarComponent, direction: number): Date;
    populateAdjacentViews(component: ICalendarComponent): void;
}
