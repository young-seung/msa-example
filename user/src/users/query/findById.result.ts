export default interface FindUserByIdQueryResult {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
