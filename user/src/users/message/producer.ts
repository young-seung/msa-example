import Amqp from 'amqplib';
import { InternalServerErrorException } from '@nestjs/common';

export default class Producer {
  private readonly queueName = 'user';

  private connection: Amqp.Connection | null = null;

  private channel: Amqp.Channel | null = null;

  public async setUp(): Promise<void> {
    this.channel = await this.getChannel();
    this.assertQueue();
  }

  public sendToQueue(message: string): void {
    if (!this.channel) throw new InternalServerErrorException('publisher channel is not exists');
    this.channel.sendToQueue(this.queueName, Buffer.from(message));
  }

  private async getChannel(): Promise<Amqp.Channel> {
    const option = { credentials: Amqp.credentials.plain('root', 'test') };
    this.connection = await Amqp.connect('amqp://localhost', option);
    if (!this.connection)
      throw new InternalServerErrorException('producer connection is not exists');
    return this.connection.createChannel();
  }

  private async assertQueue(): Promise<void> {
    if (!this.channel) throw new InternalServerErrorException('publisher channel is not exists');
    await this.channel.assertQueue(this.queueName, { durable: false });
  }
}
