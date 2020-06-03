import Event from '@src/users/event/data';

export default class Message {
  constructor(public readonly event: Event) {}
}
