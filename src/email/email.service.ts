import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  // send email to verification
  async sendOtpToVerification(name: string, email: string, otp: string) {
    return await this.emailQueue.add('signup', { name, email, otp });
  }
}
