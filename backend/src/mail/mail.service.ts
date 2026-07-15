import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const port = parseInt(this.configService.get<string>('SMTP_PORT', '465'), 10);

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.resend.com'),
      port,
      secure: port === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    this.logger.log(`Mail configured: ${this.configService.get('SMTP_HOST')}:${port} (secure: ${port === 465})`);
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    const from = this.configService.get<string>('SMTP_FROM', 'CollectorHub <noreply@collectorhub.app>');

    try {
      await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`, error.stack);
      // Don't throw — email failures shouldn't break the user flow
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const verifyUrl = `${frontendUrl}/verify-email/${token}`;

    await this.sendMail({
      to: email,
      subject: 'Verify your CollectorHub account',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #f1f5f9; padding: 40px; border-radius: 12px;">
          <h1 style="color: #6366f1; margin-bottom: 24px;">Welcome to CollectorHub 🎉</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
            Thanks for signing up! Please verify your email address to get started.
          </p>
          <a href="${verifyUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Verify Email
          </a>
          <p style="font-size: 14px; color: #64748b;">
            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    await this.sendMail({
      to: email,
      subject: 'Reset your CollectorHub password',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #f1f5f9; padding: 40px; border-radius: 12px;">
          <h1 style="color: #6366f1; margin-bottom: 24px;">Password Reset</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
            We received a request to reset your password. Click the button below to choose a new password.
          </p>
          <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #64748b;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  }
}
