import Amqp from 'amqplib';
import Message from '@src/users/rabbitmq/message';
import { InternalServerErrorException } from '@nestjs/common';

export default class Publisher {
  private readonly url = 'amqp://localhost';

  private readonly userName = 'root';

  private readonly password = 'test';

  private readonly exchange = 'user-exchange';

  private connection: Amqp.Connection | null = null;

  private channel: Amqp.Channel | null = null;

  public async setUp(): Promise<void> {
    this.channel = await this.getChannel();
    await this.assertExchange(this.exchange);
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
