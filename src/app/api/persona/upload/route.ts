import { NextRequest, NextResponse } from "next/server";
import embedAndInsert from "@/lib/backend/embedd-and-insert";
import z from "zod";
import createFormDataChunks from "@/lib/backend/create-form-data-chunks";
import { resolvePersonaCreationData } from "@/utils/backend";
import {
  FileUploadArraySchema,
  PersonaCreationInputSchema,
} from "@/types/schemas";
import uploadFiles from "@/lib/backend/uploadFiles";
import readFiles from "@/lib/backend/readFiles";
import createChunks from "@/lib/backend/create-chunks-from-files-content";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resolvedData = resolvePersonaCreationData(formData);
    const parsedFiles = FileUploadArraySchema.parse(resolvedData.file_uploads);
    const uploadedFiles = await uploadFiles("0001", "alex-morgen", parsedFiles);
    const content = await readFiles("0001", "alex-morgen", uploadedFiles);
    const docs = await createChunks(content);
    console.log(docs);
    return NextResponse.json("ok");
    const parsed = PersonaCreationInputSchema.parse("data");
    const response = await createFormDataChunks(parsed);
    await embedAndInsert(response);
    return NextResponse.json({
      success: true,
      message: "Successfully Inserted!",
    });
  } catch (error) {
    console.log(error);
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
