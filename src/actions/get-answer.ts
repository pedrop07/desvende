import { prisma } from "@/lib/prisma"

interface Response {
  answer: string
}

export async function getAnswer(): Promise<Response> {
  const response = await prisma.answer.findUnique({
    where: {
      id: process.env.ANSWER_ID
    }
  })

  const answer = response?.answer as string
  
  return {
    answer
  }
}