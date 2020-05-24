export default class FindUserQuery {
  constructor(public readonly cursorId: string, public readonly take: number) {}
}
