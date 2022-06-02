import { Controller, Get, Post, Body } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';

@Controller()
export class RequestController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    @Post("acceptRequest")
    async acceptRequest(@Body('requestId') requestId: string, @Body('comment') comment: string) {
        var respond = await this.rabbitMQService.send('acceptRequest', {requestId:requestId, comment:comment});
        return respond;
    }

    @Post("rejectRequest")
    async rejectRequest(@Body('requestId') requestId: string, @Body('comment') comment: string) {
        var respond = await this.rabbitMQService.send('rejectRequest', { requestId: requestId, comment: comment });
        return respond;
    }

    @Post("sendRequest")
    async sendRequest(@Body('description') description: string, @Body('email') email: string, @Body('location') location:string) {
        var respond = await this.rabbitMQService.send('sendRequest', { description: description, email: email, location:location });
        return respond;
    }

    @Get("listRequests")
    async listRequests() {
        var respond = await this.rabbitMQService.send('listRequests', {});
        return respond?.map(group => {
            return {
                id: group._id,
                description: group._description,
                email: group._applicantEmail,
                location: group._location
            };
        });
    }
}
