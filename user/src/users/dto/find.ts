export default class FindUserDto {
  constructor(public readonly cursorId: string, public readonly take: string) {}
}
