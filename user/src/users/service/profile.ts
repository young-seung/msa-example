import { Injectable, HttpService, Inject } from '@nestjs/common';

import AppConfiguration from '@src/app.config';

interface Profile {
  userId: string;
  name: string;
}

@Injectable()
export default class ProfileService {
  private readonly config = AppConfiguration;

  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  public async findByUserIds(userIds: string[]): Promise<Profile[]> {
    const queryString = userIds.map((userId) => `userId=${userId}`);
    const url = `${this.config.service.profile}?${queryString}`;
    const observableResponse = this.httpService.get<Profile[]>(url);
    return (await observableResponse.toPromise()).data;
  }
}
