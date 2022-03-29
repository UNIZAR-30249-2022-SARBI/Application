export type PeriodsCalendarEINA = {
    startFirstSemester: Date, endFirstSemester: Date, startSecondSemester: Date,
    endSecondSemester: Date, startSecondConvocatory: Date, endSecondConvocatory: Date };

export type DayData = {
    date: Date;
    day: string;
    week: string;
    type: string;
    comment: string[];
};

export enum CalendarEINAPeriod {
    FIRST_QUARTER = 0,
    SECOND_QUARTER = 1,
    SECOND_CONVOCATORY = 2
}

export const SpanishWeekDayLetter = new Map<number,string>([[0, 'D'], [1, 'L'], [2, 'M'], [3, 'X'], [4, 'J'], [5,'V'], [6, 'S']]);
export const WeekDayNumber = new Map<string, number>([['D', 0], [ 'L', 1], [ 'M',2], [ 'X',3], [ 'J',4], [ 'V',5], [ 'S',6]]);
