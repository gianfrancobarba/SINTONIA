import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Initialize transporter with environment variables or default values
        // For development, we can use a mock or a real SMTP service if credentials are provided
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail(to: string, subject: string, text: string): Promise<void> {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('SMTP credentials not found. Logging email to console instead.');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${text}`);
            return;
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Supporto SINTONIA" <noreply@sintonia.com>',
                to,
                subject,
                text,
            });
            console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
