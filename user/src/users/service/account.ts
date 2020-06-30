import { Injectable, HttpService, InternalServerErrorException } from '@nestjs/common';

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

  constructor(private readonly httpService: HttpService) {}

  public async findByUserId(userId: string): Promise<Account[]> {
    const url = `${this.config.service.account}?userId=${userId}`;
    const observableResponse = this.httpService.get(url);
    const response = await observableResponse.toPromise();
    if (!response || !response.data) throw new InternalServerErrorException('account service is not available');
    return response.data as Account[];
  }
}
