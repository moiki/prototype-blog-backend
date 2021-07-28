const nodemailer = require('nodemailer');
import templates from './template';
import { cyan } from 'chalk';
import Error from '../../middlewares/errorHandler';

// Import the email templates

const {
	EMAIL_PROVIDER_HOST,
	EMAIL_PROVIDER_USER,
	EMAIL_PROVIDER_PASS,
	EMAIL_PROVIDER_TLS_PORT,
	EMAIL_PROVIDER_SSL_PORT,
	NODE_ENV,
} = process.env;

const emailTransport = {
	host: EMAIL_PROVIDER_HOST,
	port: NODE_ENV === 'production' ? EMAIL_PROVIDER_SSL_PORT : EMAIL_PROVIDER_TLS_PORT,
	auth: {
		user: EMAIL_PROVIDER_USER,
		pass: EMAIL_PROVIDER_PASS,
	},
};

interface emailProvider {
	to: string;
	subject: string;
	data?: any;
	template?: any;
}

export default class EmailProvider {
	to: string;
	template?: any;
	subject: string;
	data?: any;
	transporter: any;

	constructor({ to, subject, template }: emailProvider) {
		this.template = template;
		this.to = to;
		this.subject = subject;
		this.transporter = nodemailer.createTransport(emailTransport);
	}

	sendEmail(): Promise<void> {
		return new Promise((resolve, reject) => {
			const message = {
				from: `moiki.reyes@gmail.com`,
				to: this.to,
				subject: this.subject,
				html: this.template ? this.template : templates, // Plain text body
			};

			this.transporter.sendMail(message, (err: Error, info: any) => {
				if (err) return reject(err);
				console.log(cyan(JSON.stringify(info)));
				return resolve();
			});
		});
	}
}
