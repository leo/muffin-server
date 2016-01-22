const mail = require('nodemailer')
const sendmail = require('nodemailer-sendmail-transport')

const transport = mail.createTransport(sendmail())

exports.resetPassword = function (address) {
  const details = {
    from: 'Muffin <noreply@domain.de>',
    to: address,
    subject: 'Reset Your Password',
    text: 'Ohai!'
  }

  transport.sendMail(details, function (err, info) {
    if (err) {
      throw err
    }

    console.log('Message sent: ' + JSON.stringify(info))
  })

  return true
}
