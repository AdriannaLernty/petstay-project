const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use another SMTP like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER,     // set in .env
    pass: process.env.EMAIL_PASS,     // set in .env
  },
});

function sendInvoiceEmail(to, originalName, downloadLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "PetStay Booking Invoice",
    html: `
      <h3>Thank you for your payment!</h3>
      <p>We have received your payment proof for <strong>${originalName}</strong>.</p>
      <p>You can view or download it here:</p>
      <a href="${downloadLink}" target="_blank">${downloadLink}</a>
      <p>We’ll process your booking shortly.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendInvoiceEmail };
