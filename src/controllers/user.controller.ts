import { Controller, Get, Param } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';
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
