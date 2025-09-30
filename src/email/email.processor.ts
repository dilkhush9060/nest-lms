import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'signup':
        await this.handleSignup(job);
        break;
    }
  }

  // Handle signup email
  private async handleSignup(job: Job) {
    const data = job.data as { name: string; email: string; otp: string };

    // Send email
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Email Verification',
        template: './signup',
        context: { name: data.name, otp: data.otp, email: data.email },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
