import { User } from "../model/user.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import {OAuth2Client} from "google-auth-library";

// login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please complete registration" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      //   user.token = token;
      //   await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Email or Password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

// register controller
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    if (!user || !user.otp?.isVerified) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Please verify your email first" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.password = hashPassword;
    user.role = "user";
    user.phone = phone;
    user.address = address;
    user.otp = null;

    await user.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// send otp
const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Email required" });
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser && existingUser.password) {
    return res
      .status(httpStatus.CONFLICT)
      .json({ message: "User already exists" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashOTP = await bcrypt.hash(otp, 10);

  const user = await User.findOne({ email: normalizedEmail });

  // esixting user direct update
  if (user) {
    user.otp = {
      code: hashOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
      purpose: "register",
    };

    await user.save();
  } else {
    await User.create({
      email: normalizedEmail,
      otp: {
        code: hashOTP,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
      },
    });
  }

  await sendEmail(normalizedEmail, otp);

  res.status(httpStatus.OK).json({
    message:
      "If the email is valid, you will receive an OTP. Please check your email.",
  });
};

// verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.otp) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid request" });
  }

  if (user.otp.purpose !== "register") {
    return res.status(400).json({ message: "Invalid OTP for registration" });
  }

  if (user.otp.expiresAt < new Date()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "OTP expired" });
  }

  const isMatch = await bcrypt.compare(otp, user.otp.code);

  if (!isMatch) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid OTP" });
  }

  user.otp.isVerified = true;
  await user.save();

  res.status(httpStatus.OK).json({ message: "OTP verified successfully" });
};

// forgot password first send the otp
const sendForgotPassOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Email required" });
  }

  const normalizedEmail = email.toLowerCase();

  const forgotOtp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedForgotOtp = await bcrypt.hash(forgotOtp, 10);

  const user = await User.findOne({ email: normalizedEmail });

  if (user) {
    user.otp = {
      code: hashedForgotOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
      purpose: "reset",
    };

    await user.save();
  } else {
    return res
      .status(httpStatus.OK)
      .json({ message: "If the email is valid, you will receive an OTP." });
  }

  await sendEmail(normalizedEmail, forgotOtp);

  res.status(httpStatus.OK).json({
    message:
      "If the email is valid, you will receive an OTP. Please check your email.",
  });
};

// vefify forgot password otp
const verifyForgotPassOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.otp) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid request" });
  }

  if (user.otp.purpose !== "reset") {
    return res.status(400).json({ message: "Invalid OTP for Forgot password" });
  }

  if (user.otp.expiresAt < new Date()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "OTP expired" });
  }

  const isMatch = await bcrypt.compare(otp, user.otp.code);

  if (!isMatch) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid OTP" });
  }

  user.otp.isVerified = true;
  await user.save();

  res.status(httpStatus.OK).json({ message: "OTP verified successfully" });
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "email and new password required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.otp) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (user.otp.purpose !== "reset") {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (!user.otp.isVerified) {
    return res.status(400).json({ message: "Please verify OTP first" });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedNewPassword;

  user.otp = null;

  await user.save();

  res.status(httpStatus.OK).json({ message: "Password reset successfully" });
};

//signIn with google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = async (req, res) =>{
  const {token} = req.body;

  try{
    const ticket = await client.verifyIdToken({
      idToken:token,
      audience:process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {email, name} = payload;

    let user = await User.findOne({email});

    if(!user){
      user = await User.create({
        email,
        name,
        isSocialLogin:true,
      });
    }

    const appToken = jwt.sign({
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  );

  res.json({token: appToken});

  } catch(e){
    res.status(401).json({message: e.message});
  }
};

// get user data 
const getProfile = async (req, res)=>{
  try{
    const user = await User.findById(req.user.id).select("-password");

    res.status(httpStatus.OK).json(user);
  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}

// user update 
const updateProfile = async(req, res)=>{
  try{
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {new:true}).select("-password");

    res.status(200).json(updatedUser);
  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}

export {
  register,
  login,
  sendOTP,
  verifyOTP,
  sendForgotPassOTP,
  verifyForgotPassOTP,
  resetPassword,
  googleLogin,
  getProfile,
  updateProfile
};
