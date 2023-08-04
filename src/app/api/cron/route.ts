import { NextResponse } from "next/server"
import { dictionary } from "../../../../dictionary";
import { prisma } from "@/lib/prisma";

export default async function handler() {
  try {
    const answer = dictionary[Math.floor(Math.random() * 867)].toUpperCase()

    let existAnswer = await prisma.answer.findUnique({
      where: {
        id: process.env.ANSWER_ID,
      },
    })

    if(existAnswer){
      await prisma.answer.update({
        where: {
          id: process.env.ANSWER_ID
        },
        data: {
          answer
        }
      })
    } else {
      await prisma.answer.create({
        data: {
          answer
        }
      })
    }

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
