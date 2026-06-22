import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

  } catch (e) {
    console.log("Error sending email: ", e);
  }
};

export default sendEmail;
