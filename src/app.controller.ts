import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQService } from './rabbitmq.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

    /*@Get("login/:email")
    async login(@Param('email') name) {
        var respond = await this.rabbitMQService.send('respond', {
        email: name,
        })
        console.log("receiveing "+respond)
        return respond;
    }*/
    @Post("login")
    async login(@Body('email') email) {
        var respond = await this.rabbitMQService.send('respond', {
            email: email,
        });
        console.log("receiveing " + respond);
        return { email: respond };
    }
}
