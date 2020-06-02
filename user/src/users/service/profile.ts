import { Injectable, HttpService, InternalServerErrorException } from '@nestjs/common';

interface Profile {
  userId: string;
}

@Injectable()
export default class ProfileService {
  constructor(private readonly httpService: HttpService) {}

  public async findByUserId(userId: string): Promise<Profile[]> {
    const observableResponse = this.httpService.get(
      `http://localhost:7000/profiles?userId=${userId}`,
    );
    const response = await observableResponse.toPromise();
    if (!response || !response.data)
      throw new InternalServerErrorException('profile service is not available');
    return response.data as Profile[];
  }
}
