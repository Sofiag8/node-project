const nodemailer = require('nodemailer')
const config = require('../config')

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: `${config.emailHost}`,
    port: `${config.emailPort}`,
    auth: {
      user: `${config.emailUser}`,
      pass: `${config.emailPassword}`,
    },
  })

  await transporter.sendMail({
    from: `${config.emailSender}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  })
}

module.exports = sendEmail
