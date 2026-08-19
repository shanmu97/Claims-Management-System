const nodemailer = require("nodemailer");
const logger = require("./logger");

// Create a mock/Ethereal mail transporter or a test account on the fly.
// If it fails, it will fall back to logging in files.
let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;

  try {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    logger.info("Ethereal Mail Transporter initialized successfully.");
    return transporter;
  } catch (error) {
    logger.error("Failed to initialize Nodemailer test transporter: %o", error);
    return null;
  }
};

const sendEmailNotification = async ({ to, subject, htmlText }) => {
  logger.info(`Sending email notification to: ${to}, subject: ${subject}`);
  const mailTransporter = await getTransporter();

  if (mailTransporter) {
    try {
      const info = await mailTransporter.sendMail({
        from: '"Claims Management System" <no-reply@claimsmanager.com>',
        to,
        subject,
        html: htmlText,
      });
      logger.info(`Email sent successfully. Message ID: ${info.messageId}`);
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (err) {
      logger.error("Error sending email: %o", err);
    }
  } else {
    logger.warn(`Email Service Fallback Logging:
---------------------------------------------
TO: ${to}
SUBJECT: ${subject}
BODY: ${htmlText.replace(/<[^>]*>/g, "")}
---------------------------------------------`);
  }
};

module.exports = { sendEmailNotification };
