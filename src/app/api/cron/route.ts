import { NextResponse } from "next/server"
import { dictionary } from "../../../../dictionary";

export async function GET() {
  function getRandomNumber() {
    return Math.floor(Math.random() * 867); 
  }

  const answer = dictionary[getRandomNumber()].toUpperCase()

  return NextResponse.json({ answer });
}