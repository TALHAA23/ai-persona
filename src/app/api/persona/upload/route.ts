import { NextRequest, NextResponse } from "next/server";
import embedAndInsert from "@/lib/backend/embedd-and-insert";
import z from "zod";
import { PersonaCreationInputSchema } from "@/types/schemas";
import createFormDataChunks from "@/lib/backend/create-form-data-chunks";

export async function POST(req: NextRequest) {
  try {
    // const data = await req.formData();
    const formData = await req.formData();
    console.log(formData);
    return NextResponse.json("ok");
    const parsed = PersonaCreationInputSchema.parse(data);
    const response = await createFormDataChunks(parsed);
    await embedAndInsert(response);
    return NextResponse.json({
      success: true,
      message: "Successfully Inserted!",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Failed",
          details: error.flatten(),
        },
        { status: 400, statusText: "Bad Request" }
      );
    }
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 500,
        statusText: "internal_server_error",
      }
    );
  }
}
