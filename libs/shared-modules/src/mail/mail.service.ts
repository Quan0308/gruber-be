import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { Address } from "nodemailer/lib/mailer";
@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  mailTransport() {
    return nodemailer.createTransport({
      host: this.configService.get("MAIL_HOST"),
      port: this.configService.get("MAIL_PORT"),
      secure: false,
      auth: {
        user: this.configService.get("MAIL_USER"),
        pass: this.configService.get("MAIL_PASS"),
      },
    });
  }

  async sendUserConfirmation(email: string, displayName: string, url: string) {
    try {
      const transporter = this.mailTransport();
      const options: MailOptions = {
        from: "noreply@gruber-10230.firebaseapp.com",
        replyTo: "noreply",
        to: email,
        subject: `Verify your email for ${this.configService.get("APP_NAME")}`,
        html: `
        <p>Hello ${displayName || email},</p>
        <p>Follow this link to verify your email address.</p>
        <p><a href="${url}">Link</a></p>
        <p>If you didn’t ask to verify this address, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your ${this.configService.get("APP_NAME")} team</p>
      `,
      };

      await transporter.sendMail(options);
    } catch (ex) {
      throw new Error(ex);
    }
  }
}
