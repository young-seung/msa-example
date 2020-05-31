export default interface UserEvent {
  readonly id: string;
  readonly userId: string;
  readonly email: string;
  readonly password: string;
  readonly fileId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
  readonly type: string;
}
