import { Injectable, HttpService, Inject } from '@nestjs/common';

import AppConfiguration from '@src/app.config';

interface Account {
  id: string;
  userId: string;
  email: string;
  password: string;
}

@Injectable()
export default class AccountService {
  private readonly config = AppConfiguration;

  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  public async findByUserIds(userIds: string[]): Promise<Account[]> {
    const queryString = userIds.map((userId) => `userId=${userId}`);
    const url = `${this.config.service.account}?${queryString}`;
    const observableResponse = this.httpService.get<Account[]>(url);
    return (await observableResponse.toPromise()).data;
  }
}
