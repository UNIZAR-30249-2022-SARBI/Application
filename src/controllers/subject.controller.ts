import { Controller, Get, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RmqRecordBuilder } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { RabbitMQService } from '../rabbitmq.service';
import * as fs from 'fs';

@Controller()
export class SubjectController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    @Post("uploadSubjects")
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    async uploadSubjects(@UploadedFile() file) {
        const record = new RmqRecordBuilder(this.getByteArray(file.path))
            .setOptions({
                headers: {
                    ['ContentType']: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }
            })
            .build();
        var respond = await this.rabbitMQService.send('uploadSubject', {
            record
        });
        return respond;
    }
    private getByteArray(path) {
        let fileData = fs.readFileSync(path).toString('hex');
        let fileByteArray = [];
        for (var i = 0; i < fileData.length; i += 2)
            fileByteArray.push('0x' + fileData[i] + '' + fileData[i + 1])
        return fileByteArray;
    }

    @Get("listSubjectsByTeachingGroup/:code/:period")
    async listSubjectsByTeachingGroup(@Param('code') code: string, @Param('period') period: string) {
        var respond = await this.rabbitMQService.send('listSubjectsByTeachingGroup',
            {code: code, period:period}
        );
        return respond?.map(subject => {
            return {
                id: subject._id,
                name: subject._name,
                code: subject._code,
            };
        });
    }
}
