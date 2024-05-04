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

  async sendUserConfirmation(id: string, token: string, email: string) {
    try {
      const url = `http://localhost:3001/api/auth/confirmation?id=${id}&token=${token}`;
      const transporter = this.mailTransport();
      const from: Address = {
        name: "No Reply",
        address: "bddquan@gmail.com",
      };
      const options: MailOptions = {
        from,
        to: email,
        subject: "Welcome to Gruber! Confirm your email",
        html: `<p>Please confirm your email by clicking this link: <a href="${url}">Link</a></p>`,
      };

      await transporter.sendMail(options);
    } catch (ex) {
      throw new Error(ex);
    }
  }
}
