import { NextRequest, NextResponse } from "next/server";
import embedAndInsert from "@/lib/backend/embedd-and-insert";
import z from "zod";
import createFormDataChunks from "@/lib/backend/create-form-data-chunks";
import {
  createMetadataFromForm,
  resolvePersonaCreationData,
} from "@/utils/backend";
import { PersonaCreationInputSchema } from "@/types/schemas";
import uploadFiles from "@/lib/backend/uploadFiles";
import readFiles from "@/lib/backend/readFiles";
import createChunks from "@/lib/backend/create-chunks-from-files-content";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resolvedData = resolvePersonaCreationData(formData);
    const parsed = PersonaCreationInputSchema.parse(resolvedData);

    // update metadata for each form section
    parsed.form_sections = parsed.form_sections.map((section) => ({
      ...section,
      metadata: createMetadataFromForm(
        section.section_id,
        section.section_name,
        parsed
      ),
    }));

    // data from forms
    const docsFromFormSections = await createFormDataChunks(
      parsed.form_sections
    );
    await embedAndInsert(docsFromFormSections);

    // data from files
    if (parsed.file_uploads?.length) {
      const { user_id, persona_name, file_uploads } = parsed;
      const uploads = await uploadFiles(user_id, persona_name, file_uploads);
      const filesContent = await readFiles(user_id, persona_name, uploads);
      const docsFromFilesContent = await createChunks(filesContent);
      await embedAndInsert(docsFromFilesContent);
    }

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
