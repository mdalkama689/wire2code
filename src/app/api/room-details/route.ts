import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOption from "../auth/[...nextauth]/option";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "unauthorised, please login to continue",
      });
    }

    const { roomId }: { roomId: string } = await req.json();

    const room = await prisma.chat.findFirst({
      where: {
        roomId,
      },
    });

    if (!room) {
      return NextResponse.json({
        success: false,
        message: "Room not found!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Room data fetch successfully!",
      room,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Somwthing went wrong while fetching room deatils";
    return NextResponse.json({
      success: false,
      message: errorMessage,
    });
  }
}
