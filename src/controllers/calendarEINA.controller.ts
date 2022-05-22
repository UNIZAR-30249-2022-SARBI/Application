import { Controller, Get, Param, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from '../app.service';
import { RabbitMQService } from '../rabbitmq.service';
import { CalendarEINAPeriod, DayData, PeriodCalendarWord, PeriodsCalendarEINAData, SpanishWeekDayLetter, WeekDayNumber } from './types';
@Controller()
export class CalendarEINAController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    @Post("login")
    async login(@Body('email') email) {
        var respond = await this.rabbitMQService.send('respond', {
            email: email,
        });
        return { email: respond };
    }

    @Post("createCalendarEINA")
    async createCalendarEINA(@Body('course') course: string, @Body('version') version: number, @Body('periods') periods: PeriodsCalendarEINAData) {
        var respond = await this.rabbitMQService.send('createCalendarEINA', { course: course, version: version, periods: periods });
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        return respond;
    }

    @Post("editCalendarEINA")
    async editCalendarEINA(@Body('course') course: string, @Body('version') version: number, @Body('periods') periods: PeriodsCalendarEINAData) {
        var respond = await this.rabbitMQService.send('editCalendarEINA', { course: course, version: version, periods: periods });
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        return respond;
    }
    @Get("listPeriodsCalendarEINA/:course/:version")
    async listPeriodsCalendarEINA(@Param('course') course: string, @Param('version') version: number) {
        var respond = await this.rabbitMQService.send('listPeriodCalendarEINA', { course: course, version: version });
        let periods = {};
        respond?.forEach((period, index) => {
            periods[PeriodCalendarWord.get(index)] = { startDate: period._startDate, endDate: period._endDate }
            }
        )
        return periods;
    }
    @Get("listAllCalendars")
    async listAllCalendars() {
        var respond = await this.rabbitMQService.send('listAllCalendars', {});
        return respond?.map(calendar => {
            return {
                course: calendar._course,
                version: calendar._version,
            };
        });
    }
    @Get("listFirstSemesterCalendarEINA/:course/:version")
    async listFirstSemesterCalendarEINA(@Param('course') course: string, @Param('version') version: number) {
        return await this.listCalendarEINA(course, version, CalendarEINAPeriod.FIRST_QUARTER);
    }
    @Get("listSecondSemesterCalendarEINA/:course/:version")
    async listSecondSemesterCalendarEINA(@Param('course') course: string, @Param('version') version: number) {
        return await this.listCalendarEINA(course, version, CalendarEINAPeriod.SECOND_QUARTER);

    }
    @Get("listSecondConvocatoryCalendarEINA/:course/:version")
    async listSecondConvocatoryCalendarEINA(@Param('course') course: string, @Param('version') version: number) {
        return await this.listCalendarEINA(course, version, CalendarEINAPeriod.SECOND_CONVOCATORY);
    }
    async listCalendarEINA(course:string,version: number, period: CalendarEINAPeriod) {
        var respond = await this.rabbitMQService.send('listDaysByPeriodCalendarEINA', { course: course, version: version, period: period });
        return respond?.map(day => {
            return {
                date: day._date, 
                day: SpanishWeekDayLetter.get(day._weekDay),
                week: day._weekLetter?.toLowerCase(),
                type: day._state,
                comment: day._comment,
            };
        });
    }

    @Post("deleteCalendarEINA")
    async deleteCalendarEINA(@Body('course') course: string, @Body('version') version: number) {
        var respond = await this.rabbitMQService.send('deleteCalendarEINA', { course: course, version: version });
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

        return respond;
    }
    private getUTCDate(d: Date) { 
        const date = new Date(d);
        let thisDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        return thisDate;
    }
    @Post("editDayEINA")
    async editDayEINA(@Body('dayData') dayData: DayData, @Body('course') course: string, @Body('version') version: number) {
        let thisComment = dayData.comment.length === 0 ? [] : [dayData.comment];
        var respond = await this.rabbitMQService.send('editDayEINA', {day:{ date: this.getUTCDate(dayData.date), weekDay: WeekDayNumber.get(dayData.day), weekLetter: dayData.week?.toUpperCase(), state: dayData.type, comment: thisComment }, course:course, version:version});
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        return respond;
    }
}
