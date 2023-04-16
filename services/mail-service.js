const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        })
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Registration kommunal26.de',
            text: "",
            html:
            `
                <div>Hello <a href="${link}">click to activate you account.</a></div>
            `
        })
    }

    async sendResetPasswordMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Reset password instructions",
            text: "",
            html:
            `
                <div>
                Hello. 
                Someone has requested a link to change your password, and you can do this through the link below.
                <a href="${link}">Change my password.</a>
                If you did not request this, please ignore this email.
                Your password will not change until you access the link above and create a new one.
                </div>
            `
        })
    }
}

module.exports = new MailService();