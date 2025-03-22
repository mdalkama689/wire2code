import generateOtp from "@/helper/generateOtp";
import prisma from "@/lib/prisma";
import signUpSchema from "@/types/signup-schema";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import sendEmail from "@/helper/sendEmail";

interface IBody {
  fullName: string;
  email: string;
  password: string;
}
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: IBody = await req.json();
    const safeParse = signUpSchema.safeParse(body);

    if (!safeParse.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid input",
      });
    }

    const { fullName, email, password } = safeParse.data;

    const userExists = await prisma.user.findFirst({
      where: { email },
    });
    if (userExists && userExists.isVerified) {
      return NextResponse.json({
        success: false,
        message: "user already exists",
      });
    }

    const otp = generateOtp();

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      parallelism: 4,
      timeCost: 3,
    });

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        fullName,
        otp: Number(otp),
      },
    });
    const response = await sendEmail(email, otp);

    if (!response.success) {
      return NextResponse.json({
        success: false,
        message: response.message,
      });
    }
    console.log("response : ", response);
    return NextResponse.json({
      success: true,
      message: `An OTP has been sent to your email: ${email}`,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while signup!";
    return NextResponse.json({
      success: false,
      message: errorMessage,
    });
  }
}
