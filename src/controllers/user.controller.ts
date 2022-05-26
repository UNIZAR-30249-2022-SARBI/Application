import { Controller, Get, Param, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from '../app.service';
import { RabbitMQService } from '../rabbitmq.service';
import { CalendarEINAPeriod, DayData, PeriodCalendarWord, PeriodsCalendarEINAData, SpanishWeekDayLetter, WeekDayNumber } from './types';
@Controller()
export class UserController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    @Get("login/:email")
    async login(@Param('email') email) {
        var respond = await this.rabbitMQService.send('userLogin', {
            email: email,
        });
        return respond;
    }
}
