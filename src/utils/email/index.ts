const nodemailer = require("nodemailer");
import { cyan } from "chalk";
import { InvitationTemplate } from "./templates/InvitationTemplate";
// Import the email templates

const {
  EMAIL_PROVIDER_HOST,
  EMAIL_SERVICE,
  EMAIL_PROVIDER_USER,
  EMAIL_PROVIDER_PASS,
  EMAIL_PROVIDER_TLS_PORT,
  EMAIL_PROVIDER_SSL_PORT,
  NODE_ENV,
} = process.env;

const emailTransport = {
  host: EMAIL_PROVIDER_HOST,
  service: EMAIL_SERVICE,
  port:
    NODE_ENV === "production"
      ? EMAIL_PROVIDER_SSL_PORT
      : EMAIL_PROVIDER_TLS_PORT,
  auth: {
    user: EMAIL_PROVIDER_USER,
    pass: EMAIL_PROVIDER_PASS,
  },
};

interface emailProvider {
  to: string;
  template: "invitation_email";
  subject: string;
  data?: any;
}

export default class EmailProvider {
  to: string;
  template: "invitation_email";
  subject: string;
  data?: any;
  transporter: any;

  constructor({ to, template, subject, data }: emailProvider) {
    this.to = to;
    this.template = template;
    this.subject = subject;
    this.data = data;
    this.transporter = nodemailer.createTransport(emailTransport);
  }

  chooseTemplate() {
    return InvitationTemplate({
      hash: this.data.hash,
    });
  }

  sendEmail(): Promise<void> {
    return new Promise((resolve, reject) => {
      const message = {
        from: `moiki.reyes@gmail.com`,
        to: this.to,
        subject: this.subject,
        html: this.chooseTemplate(), // Plain text body
      };

      this.transporter.sendMail(message, (err: Error, info: any) => {
        if (err) return reject(err);
        console.log(cyan(JSON.stringify(info)));
        return resolve();
      });
    });
  }
}
