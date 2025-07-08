import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import path from "node:path";
import createChunks from "@/lib/backend/create-chunks";
import embedAndInsert from "@/lib/backend/embedd-and-insert";
import z from "zod";
import {
  ChunkDocumentSchema,
  PersonaCreationInputSchema,
} from "@/types/schemas";
import formSectionDataToString from "@/utils/backend/form-section-data-to-string";

const dummeyMetaData: z.infer<typeof ChunkDocumentSchema>["metadata"] = {
  category: "hobbies",
  file_id: "001",
  persona_id: "002",
  section_id: "3232",
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = PersonaCreationInputSchema.parse(data);
    const details = formSectionDataToString(parsed.form_sections);
    return NextResponse.json(details.join("\n"));
    const filePath = path.join(process.cwd(), "public", "bio.md");
    const userFile = await fs.readFile(filePath, { encoding: "utf-8" });
    const docs = await createChunks(userFile, dummeyMetaData);

    await embedAndInsert(docs);
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
