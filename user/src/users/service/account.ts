import { Injectable, HttpService, InternalServerErrorException } from '@nestjs/common';

interface Account {
  id: string;
  userId: string;
  email: string;
  password: string;
}

@Injectable()
export default class AccountService {
  constructor(private readonly httpService: HttpService) {}

  public async findByUserId(userId: string): Promise<Account[]> {
    const observableResponse = this.httpService.get(
      `http://localhost:6000/accounts?userId=${userId}`,
    );
    const response = await observableResponse.toPromise();
    if (!response || !response.data)
      throw new InternalServerErrorException('account service is not available');
    return response.data as Account[];
  }
}
