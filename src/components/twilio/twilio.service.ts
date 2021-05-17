import { Injectable } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";
import * as twilio from "twilio";
import { ConfigService } from "@nestjs/config";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { EmailDto, VerificationDto } from "../user/user.dto";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";

// https://www.twilio.com/docs/verify/email?code-sample=code-start-a-verification-with-email-1&code-language=Node.js&code-sdk-version=3.x
@Injectable()
export class TwilioService {
  client: twilio.Twilio;
  key: string;
  token: string;
  service: string;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {
    this.key = this.configService.get("TWILIO_SID");
    this.token = this.configService.get("TWILIO_TOKEN");

    this.service = `VAa3c416c2d6583fde9e04c594b73d7b13`;

    this.client = new twilio.Twilio(this.key, this.token);
  }

  public async sendSms(body: string, to: string): Promise<any> {
    return this.client.messages.create({
      from: "(253) 944-9157",
      to,
      body,
    });
  }

  public async sendCodeEmail(email: string) {
    const sent: VerificationInstance = await this.client.verify
      .services(this.service)
      .verifications.create({
        to: email,
        channel: "email",
      });
    if (sent.status === "pending") {
      return true;
    }
  }

  public async verify(method: VerificationDto) {
    const { code, email } = method;
    this.loggerService.log(email);
    const { status, serviceSid }: VerificationCheckInstance = await this.client.verify
      .services(this.service)
      .verificationChecks.create({
        to: email,
        code: code,
      });
    this.loggerService.log(serviceSid);
    this.loggerService.log(status);
    if (status === "approved") return true;
  }
}
