import Amqp from 'amqplib';
import { InternalServerErrorException } from '@nestjs/common';
import AppConfiguration from '../../../app.config';

export default class Consumer {
  private readonly queueName = 'profile';

  private readonly url: string;

  private readonly userName: string;

  private readonly password: string;

  private connection: Amqp.Connection | null = null;

  private channel: Amqp.Channel | null = null;

  constructor() {
    this.url = AppConfiguration.RABBITMQ_URL;
    this.userName = AppConfiguration.RABBITMQ_USERNAME;
    this.password = AppConfiguration.RABBITMQ_PASSWORD;
  }

  public async setUp(): Promise<void> {
    this.channel = await this.getChannel();
    this.assertQueue();
  }

  public async consumeFromQueue(): Promise<void> {
    if (!this.channel) throw new InternalServerErrorException('consumer channel is not exists');
    await this.channel.consume(this.queueName, (message) => message, { noAck: true });
  }

  private async getChannel(): Promise<Amqp.Channel> {
    const options = { credentials: Amqp.credentials.plain(this.userName, this.password) };
    this.connection = await Amqp.connect(this.url, options);
    if (!this.connection) throw new InternalServerErrorException('consumer channel is not exists');
    return this.connection.createChannel();
  }

  private async assertQueue(): Promise<void> {
    if (!this.channel) throw new InternalServerErrorException('consumer channel is not exists');
    await this.channel.assertQueue(this.queueName, { durable: false });
  }
}
