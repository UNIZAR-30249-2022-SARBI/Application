import { Controller, Get, Param, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';

@Controller()
export class GrouptSubjectScheduleController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    @Get("listAllTeachingGroups")
    async listTeachingGroups() {
        var respond = await this.rabbitMQService.send('listAllTeachingGroups', {});
        return respond?.map(group => {
            return {
                career: group._career,
                course: group._course,
                period: group._period,
                code: group._code
            };
        });
    }

    @Post("addScheduleSlot")
    async addScheduleSlot(@Body() data) {
        var respond = await this.rabbitMQService.send('addScheduleSlot', data);
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        return respond;
    }

    @Post("removeScheduleSlot")
    async removeScheduleSlot(@Body() data) {
        var respond = await this.rabbitMQService.send('removeScheduleSlot', data);
        if (respond == undefined) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        return respond;
    }
    
    @Get("listScheduleByTeachingGroup/:code/:period")
    async listScheduleByTeachingGroup(@Param('code') code: string, @Param('period') period: string) {
        var respond = await this.rabbitMQService.send('listScheduleByTeachingGroup',
            { code: code, period: period }
        );
        
        return respond?.map(slot => {
            return {
                startHour: slot._startHour,
                endHour: slot._endHour,
                weekDay: slot._weekDay,
                location: slot._location,
            };
        });
    }
}
