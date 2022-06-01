import { Controller, Get, Param, Post, Body, Query, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RmqRecordBuilder } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { RabbitMQService } from '../rabbitmq.service';
import * as fs from 'fs';

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
}
