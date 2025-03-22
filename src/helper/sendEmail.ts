import nodemailer from "nodemailer";

async function sendEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "",
    to: email,
    subject: "Wire2Code - OTP Verification",
    text: `Your OTP for verification is: ${otp}. This OTP is valid for 10 minutes. Please do not share it with anyone.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully!" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while sending message";
    return { success: false, message: errorMessage };
  }
}

export default sendEmail;
