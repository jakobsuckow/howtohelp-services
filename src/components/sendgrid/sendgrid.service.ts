import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailDataRequired, send, setApiKey } from "@sendgrid/mail";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class SendgridService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {
    setApiKey(this.configService.get("SENDGRID_API_KEY"));
  }

  private async sendEmail({
    to,
    templateId,
  }: {
    to: string | string[];
    templateId: string;
  }): Promise<void> {
    const mail: MailDataRequired = {
      from: "info@howtohelp.guide",
      to: to,
      templateId: templateId,
    };
    try {
      send(mail);
    } catch (error) {
      this.loggerService.error("Error whilst sending email", error.message);
    }
  }

  public async newApplication(to: string): Promise<void> {
    return Promise.all([
      this.sendEmail({ to: to, templateId: "d-d817a20198474de0bd8e66481e80a0ea " }),
      this.sendEmail({
        to: "info@howtohelp.guide",
        templateId: "d-1f78cb8c81d2470a89c4446a27610e64",
      }),
    ])
      .then(() => {
        this.loggerService.log("new application by");
      })
      .catch((err: Error) => {
        this.loggerService.error("error when sending email", err.message);
      });
  }
}
