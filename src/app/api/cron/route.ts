import { NextResponse } from "next/server"
import { dictionaryOfPossibleAnswers } from "../../../../dictionary-of-possible-answers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const answer = dictionaryOfPossibleAnswers[Math.floor(Math.random() * 914)].toUpperCase()

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
