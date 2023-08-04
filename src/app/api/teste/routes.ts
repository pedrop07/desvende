import { NextResponse } from "next/server"
import { dictionary } from "../../../../dictionary";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const response = await prisma.answer.findUnique({
      where: {
        id: process.env.ANSWER_ID
      }
    })

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
