const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendInvoiceEmail(to, originalName, downloadLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "PetStay Booking Invoice",
    html: `
      <h3>Thank you for your payment!</h3>
      <p>We have received your payment proof: <strong>${originalName}</strong>.</p>
      <p>You can view or download it here:</p>
      <a href="${downloadLink}">${downloadLink}</a>
      <p>Our team will verify and confirm your booking shortly.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendInvoiceEmail };
