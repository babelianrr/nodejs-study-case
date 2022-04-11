const nodemailer = require("nodemailer")

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      port: process.env.PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: text,
    })
    console.log("Email sent sucessfully")
  } catch (error) {
    console.log("Email not sent")
    console.log(error)
  }
}

module.exports = sendEmail