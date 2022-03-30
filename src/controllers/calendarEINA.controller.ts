import { Controller, Get, Param, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from '../app.service';
import { RabbitMQService } from '../rabbitmq.service';
import { CalendarEINAPeriod, DayData, PeriodsCalendarEINA, SpanishWeekDayLetter, WeekDayNumber } from './types';
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
    async createCalendarEINA(@Body() periods: PeriodsCalendarEINA) {
        var respond = await this.rabbitMQService.send('createCalendarEINA', periods);
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

        return respond;
    }

    @Post("listFirstSemesterCalendarEINA")
    async listFirstSemesterCalendarEINA(@Body('year') year: number) {
        return await this.listCalendarEINA(year, CalendarEINAPeriod.FIRST_QUARTER);

    }
    @Post("listSecondSemesterCalendarEINA")
    async listSecondSemesterCalendarEINA(@Body('year') year: number) {
        return await this.listCalendarEINA(year, CalendarEINAPeriod.SECOND_QUARTER);

    }
    @Post("listSecondConvocatoryCalendarEINA")
    async listSecondConvocatoryCalendarEINA(@Body('year') year: number) {
        return await this.listCalendarEINA(year, CalendarEINAPeriod.SECOND_CONVOCATORY);
    }
    async listCalendarEINA(year: number, period: CalendarEINAPeriod) {
        var respond = await this.rabbitMQService.send('listPeriodCalendarEINA', { year: year, period: period });
        return respond.map(day => {
            let props = day._props;
            return {
                date: props.date,
                day: SpanishWeekDayLetter.get(props.weekDay),
                week: props.weekLetter?.toLowerCase(),
                type: props.state,
                comment: props.comment,
            };
        });
    }

    @Post("deleteCalendarEINA")
    async deleteCalendarEINA(@Body('year') year: number) {
        var respond = await this.rabbitMQService.send('deleteCalendarEINA', year);
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

        return respond;
    }
    private getUTCDate(d: Date) {
        const date = new Date(d);
        let thisDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        return thisDate;
    }
    @Post("editDayEINA")
    async editDayEINA(@Body() dayData: DayData) {
        let thisComment = dayData.comment.length === 0 ? [] : [dayData.comment];
        var respond = await this.rabbitMQService.send('editDayEINA', { date: this.getUTCDate(dayData.date), weekDay: WeekDayNumber.get(dayData.day), weekLetter: dayData.week?.toUpperCase(), state: dayData.type, comment: thisComment });
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        return respond;
    }
}
