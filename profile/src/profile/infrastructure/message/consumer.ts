import Amqp from 'amqplib';
import { InternalServerErrorException } from '@nestjs/common';

export default class Consumer {
  private readonly queueName = 'profile';

  private connection: Amqp.Connection | null = null;

  private channel: Amqp.Channel | null = null;

  public async setUp(): Promise<void> {
    this.channel = await this.getChannel();
    this.assertQueue();
  }

  public async consumeFromQueue(): Promise<void> {
    if (!this.channel) throw new InternalServerErrorException('consumer channel is not exists');
    await this.channel.consume(this.queueName, (message) => message, { noAck: true });
  }

  private async getChannel(): Promise<Amqp.Channel> {
    const options = { credentials: Amqp.credentials.plain('root', 'test') };
    this.connection = await Amqp.connect('amqp://localhost', options);
    if (!this.connection) throw new InternalServerErrorException('consumer channel is not exists');
    return this.connection.createChannel();
  }

  private async assertQueue(): Promise<void> {
    if (!this.channel) throw new InternalServerErrorException('consumer channel is not exists');
    await this.channel.assertQueue(this.queueName, { durable: false });
  }
}
