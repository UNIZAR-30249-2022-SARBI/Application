import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'rabbit-mq-module',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://cvnjcdyw:RoDsoKA93AwQiJKg5WhC35FzeD20LQm9@roedeer.rmq.cloudamqp.com/cvnjcdyw'
          ],
          queue: 'gicuz',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})

export class RabbitMQModule {}
