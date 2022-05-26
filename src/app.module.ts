import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarEINAController } from './controllers/calendarEINA.controller';
import { UserController } from './controllers/user.controller';
import { RabbitMQModule } from './rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [CalendarEINAController, UserController],
  providers: [AppService],
})

export class AppModule {}
