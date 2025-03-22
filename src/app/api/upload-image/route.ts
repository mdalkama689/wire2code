import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai'

// cloudinary.config({
//   cloud_name: 'dekzcqfyf',
//   api_key: "178764317215198",
//   api_secret:"uTmx4QxEoxsGXQgJMpJDz0UXTTo",
// });


// const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: "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"
// })

export async function POST(req: NextRequest) {
    try {
     
  
      return NextResponse.json({ data: data.choices[0]?.message.content });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }