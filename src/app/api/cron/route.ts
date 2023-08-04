import { NextResponse } from "next/server"
import { dictionary } from "../../../../dictionary";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const answer = dictionary[Math.floor(Math.random() * 867)].toUpperCase()

    await prisma.answer.update({
      where: {
        id: process.env.ANSWER_ID
      },
      data: {
        answer
      }
    })

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
