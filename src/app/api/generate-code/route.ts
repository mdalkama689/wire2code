import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOption from "../auth/[...nextauth]/option";
import generateCodeSchema from "@/types/generate-code-schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "unauthenticated, please login to continue!",
      });
    }

    const body = await req.json();

    const safeParsed = generateCodeSchema.safeParse(body);

    if (!safeParsed.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid input!",
      });
    }

    const { modelName, CODE_PROMPT, imageUrl, roomId } = safeParsed.data;

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

    const response = fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: CODE_PROMPT,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      }),
    });

    const json = await (await response).json();
    const message = json?.choices?.[0].message.content;
    const result = message?.replaceAll("`", " ").replaceAll("json", " ");

    const parsedResult = JSON.parse(result);

    await prisma.chat.update({
      where: { id: room.id },
      data: {
        files: parsedResult.files,
      },
    });

    return NextResponse.json({
      success: true,
      message: "fetching code...",
      result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating code",
    });
  }
}
