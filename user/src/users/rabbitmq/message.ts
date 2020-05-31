import Event from '@src/users/event/event';

export default class Message {
  constructor(public readonly event: Event) {}
}
