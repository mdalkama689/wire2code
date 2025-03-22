import prisma from "@/lib/prisma";
import createRoomSchema from "@/types/create-room-schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOption from "../auth/[...nextauth]/option";
import uploadFile from "@/helper/uploadFile";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "unauthorized, please login to continue",
      });
    }
    const formData = await req.formData();
    const roomId = formData.get("roomId")?.toString().trim();
    const selectedFile = formData.get("selectedFile") as File;
    const description = formData.get("description")?.toString().trim();
    const selectedModel = formData.get("selectedModel")?.toString().trim();

    if (!roomId) {
      return NextResponse.json({
        success: false,
        message: "please provide roomId",
      });
    }

    const safeParsed = createRoomSchema.safeParse({
      roomId,
      selectedFile,
      description,
      selectedModel,
    });

    if (!safeParsed.success) {
      return NextResponse.json({
        success: false,
        message: "Incorrect input!",
      });
    }

    const responseUploadFile = await uploadFile(selectedFile);

    const roomExists = await prisma.chat.findFirst({
      where: {
        roomId,
      },
    });

    if (roomExists) {
      return NextResponse.json({
        success: false,
        message: "Room already registered!",
      });
    }

    await prisma.chat.create({
      data: {
        roomId,
        userId: Number(session.user.id),
        imageUrl: responseUploadFile.secure_url,
        description,
        selectedModel,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Room created succesfully!",
    });
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while creating a room!";
    return NextResponse.json({
      success: false,
      message: errorMessage,
    });
  }
}
