import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    return user;
  }
}
