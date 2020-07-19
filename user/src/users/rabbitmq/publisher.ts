import Amqp from 'amqplib';
import Message from '@src/users/rabbitmq/message';
import { InternalServerErrorException } from '@nestjs/common';

import AppConfiguration from '@src/app.config';

export default class Publisher {
  private readonly exchange = 'user-exchange';

  private readonly url: string;

  private readonly userName: string;

  private readonly password: string;

  private readonly onRejected = (error: Error): never => {
    throw new InternalServerErrorException(error);
    return process.exit(1);
  };

  private connection: Amqp.Connection | null = null;

  private channel: Amqp.Channel | null = null;

  constructor() {
    this.url = AppConfiguration.rabbitmq.url;
    this.userName = AppConfiguration.rabbitmq.userName;
    this.password = AppConfiguration.rabbitmq.password;
  }

  public async setUp(): Promise<void> {
    this.channel = await this.getChannel().catch(this.onRejected);
    return this.assertExchange(this.exchange).catch(this.onRejected);
  }

  public publish(message: Message): void {
    if (!this.channel) process.exit(1);
    const content = JSON.stringify(message);
    const result = this.channel.publish(this.exchange, message.key, Buffer.from(content));
    if (!result) throw new InternalServerErrorException('can not publish message');
  }

  private async getChannel(): Promise<Amqp.Channel> {
    const option = { credentials: Amqp.credentials.plain(this.userName, this.password) };
    this.connection = await Amqp.connect(this.url, option);
    if (!this.connection) process.exit(1);
    return this.connection.createChannel();
  }

  private async assertExchange(exchange: string): Promise<void> {
    if (!this.channel) process.exit(1);
    await this.channel.assertExchange(exchange, 'topic', { durable: false });
  }
}
