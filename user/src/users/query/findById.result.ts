export default interface FindUserByIdQueryResult {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
