import { Injectable, HttpService, InternalServerErrorException } from '@nestjs/common';

import AppConfiguration from '@src/app.config';

interface Profile {
  userId: string;
}

@Injectable()
export default class ProfileService {
  private readonly config = AppConfiguration;

  constructor(private readonly httpService: HttpService) {}

  public async findByUserId(userId: string): Promise<Profile[]> {
    const url = `${this.config.service.profile}?userId=${userId}`;
    const observableResponse = this.httpService.get(url);
    const response = await observableResponse.toPromise();
    if (!response || !response.data) throw new InternalServerErrorException('profile service is not available');
    return response.data as Profile[];
  }
}
