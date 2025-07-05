import answerChat from "@/lib/backend/answer-chat";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        {
          error: "Question can't be empty.",
        },
        { status: 400, statusText: "Bad Request" }
      );
    }

    const response = await answerChat(question);
    return NextResponse.json({
      message: response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
