interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

type UserList = Array<User>;

export default interface FindUserQueryResult {
  data: UserList;
  hasMore: boolean;
}
