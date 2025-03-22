import prisma from "@/lib/prisma";
import otpSchema from "@/types/otp-schema";
import { NextRequest, NextResponse } from "next/server";

interface IBody {
  email: string;
  otp: string;
}
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: IBody = await req.json();

    const safeParse = otpSchema.safeParse(body);

    if (!safeParse.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid inputs",
      });
    }

    const { email, otp } = safeParse.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "user not found!",
      });
    }

    if (user && user.isVerified) {
      return NextResponse.json({
        success: false,
        message: "user already registred!",
      });
    }

    const isOtpValid = Number(user.otp) === Number(otp);
    const otpExpirationTime =
      new Date(user.otpGeneratedAt).getTime() + 10 * 60 * 1000;
    const isOtpNotExpired = otpExpirationTime > Date.now();

    if (!isOtpValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid otp",
      });
    }
    if (!isOtpNotExpired) {
      return NextResponse.json({
        success: false,
        message: "Expired otp",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
      },
    });
    return NextResponse.json({
      success: true,
      message: "OTP verification successfully!",
      user,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while verifying email!";
    return NextResponse.json({
      success: false,
      message: errorMessage,
    });
  }
}
