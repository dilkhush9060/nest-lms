import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async get(userId: string) {
    const user = await this.userService.findById(userId);
    return user;
  }
}
