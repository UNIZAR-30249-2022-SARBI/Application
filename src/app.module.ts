import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarEINAController } from './controllers/calendarEINA.controller';
import { GrouptSubjectScheduleController } from './controllers/groupSubjectSchedule.controller';
import { RequestController } from './controllers/request.controller';
import { SubjectController } from './controllers/subject.controller';
import { UserController } from './controllers/user.controller';
import { RabbitMQModule } from './rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [CalendarEINAController, UserController, SubjectController, GrouptSubjectScheduleController, RequestController],
  providers: [AppService],
})

export class AppModule {}
