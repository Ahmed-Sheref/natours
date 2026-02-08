const nodemailer = require('nodemailer');
const pug = require('pug');
// const { options } = require('..');

exports.sendEmail = async (options) =>
{
    const transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth:
            {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        }
    )


    const html = pug.renderFile(`${__dirname}/../views/emails/${options.template}.pug`, 
    {
        firstName: options.user.name.split(' ')[0],
        url: options.url,
        subject: options.subject
    });
    const mailOptions = 
    {
        from: `Natours Admin <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: html,
        text: html
    }

    await transporter.sendMail(mailOptions);
}