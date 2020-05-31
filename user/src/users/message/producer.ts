import Amqp from 'amqplib';
import Message from '@src/users/message/message';

export default class Producer {
  private readonly queueName = 'user';

  private connection: Amqp.Connection | null = null;

  private channel: Amqp.Channel | null = null;

  public async setUp(): Promise<void> {
    this.channel = await this.getChannel();
    this.assertQueue();
  }

  public sendToQueue(message: Message): void {
    if (!this.channel) process.exit(1);
    const content = JSON.stringify(message);
    this.channel.sendToQueue(this.queueName, Buffer.from(content));
  }

  private async getChannel(): Promise<Amqp.Channel> {
    const option = { credentials: Amqp.credentials.plain('root', 'test') };
    this.connection = await Amqp.connect('amqp://localhost', option);
    if (!this.connection) process.exit(1);
    return this.connection.createChannel();
  }

  private async assertQueue(): Promise<void> {
    if (!this.channel) process.exit(1);
    await this.channel.assertQueue(this.queueName, { durable: false });
  }
}
