const nodemailer = require("nodemailer");
const { config } = require('./../config/config');

class MailService {
  getTansport() {
    const transporter = nodemailer.createTransport({
      // host: "ses-smtp-user.20221116-084817",
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 587,
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword
      }
    });
    return transporter
  }

  async sendEmail(user, subject, html) {
    const transport = this.getTansport();
    return await transport.sendMail({
      from: 'noreply@arriendahoy.com.co',
      to: `${user.email}`,
      subject: subject,
      html: html,
    });
  }

  async recoveryPassword(user, link) {
    const subject = "Email para recuperar contraseña";
    const html = `<b>Ingresa a este link => ${link} para recuperar la contraseña</b>`;
    return this.sendEmail(user, subject, html);
  }

  async sendEmailReset(user) {
    const subject = "Resetear contraseña";
    const html = "<b>Recupera dando clic aquí</b>";
    return this.sendEmail(user, subject, html);
  }
}

module.exports = MailService;
