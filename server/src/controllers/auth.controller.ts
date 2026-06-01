import { Request, Response } from "express";
import { decodeidI } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../config/db";
import { sendEmail } from "../services/email.service";
import { generateOtp, getOtpHtml } from "../utils/otp.util";

//---- signup----//
const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
    } else {
      return res.status(400).json({
        message: "user with this email already exists",
        existingUser,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await client.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { otp, expiresAt } = generateOtp();
    const otpHtml = getOtpHtml(otp);

    const hashedOtp = await bcrypt.hash(otp, 10);

    await client.otp.create({
      data: {
        otpHash: hashedOtp,
        expiresAt: new Date(expiresAt),
        userId: user.id,
      },
    });

    await sendEmail(
      user.email,
      "Your OTP Code",
      `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      otpHtml,
    );

    // const refreshToken = jwt.sign(
    //   { id: user.id },
    //   process.env.JWT_SECRET as string,
    //   {
    //     expiresIn: "10d",
    //   },
    // );

    // const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    // const session = await client.session.create({
    //   data: {
    //     refreshTokenHash: hashedRefresh,
    //     ip: req.ip,
    //     userAgent: req.headers["user-agent"],
    //     userId: user.id,
    //   },
    // });

    // const accessToken = jwt.sign(
    //   {
    //     id: user.id,
    //     sessionId: session.id,
    //   },
    //   process.env.JWT_SECRET as string,
    //   {
    //     expiresIn: "10m",
    //   },
    // );

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.status(200).json({
      message: "successfully signed up, please verify your email",
      user: {
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const userOtp = await client.otp.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userOtp) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (userOtp.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const isValid = await bcrypt.compare(otp, userOtp.otpHash);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await client.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
      },
    });

    await client.otp.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default { signup, verifyEmail };
