const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');


module.exports = class Email
{
    constructor(user, url)
    {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Natours Admin <${process.env.EMAIL_FROM}>`;
    }


    newTransport()
    {
        return nodemailer.createTransport(
        {
            service: 'gmail',

            auth:
            {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }


    async send(template, subject)
    {
        // 1) Render HTML from pug template
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject
            }
        );


        // 2) Define email options
        const mailOptions =
        {
            from: this.from,
            to: this.to,
            subject,
            html,

            // plain text version
            text: convert(html)
        };


        // 3) Send email
        await this.newTransport().sendMail(mailOptions);
    }


    async sendWelcome()
    {
        await this.send(
            'welcome',
            'Welcome to the Natours Family!'
        );
    }


    async sendPasswordReset()
    {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};