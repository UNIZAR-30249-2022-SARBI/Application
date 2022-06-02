import { Controller, Get, Param } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
@Controller()
export class AppController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
  ) {}

    @Get("login/:email")
    async login(@Param('email') name) {
        var respond = await this.rabbitMQService.send('respond', {
        email: name,
        })
        console.log("receiveing "+respond)
        return respond;
    }
    
}
