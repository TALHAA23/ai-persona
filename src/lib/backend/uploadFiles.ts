import { FileUploadSchema } from "@/types/schemas";
import z from "zod";
import { supabaseClient } from "./supabase-client";
import { ERROR_TAGS } from "@/utils/shared/CONST";
import { formatErrorMessage } from "@/utils/backend";

export default async function uploadFiles(
  userId: string,
  personaId: string,
  files: z.infer<typeof FileUploadSchema>[]
) {
  try {
    const uploads = files.map(({ file }) => {
      const path = `${userId}/${personaId}/${file.name}`;
      return supabaseClient.storage.from("files").upload(path, file, {
        upsert: true,
      });
    });

    // TODO: Hanlde success = rejected
    const results = await Promise.allSettled(uploads);
    return results.map((result, index) => ({
      filename: files[index].file.name,
      success: result.status == "fulfilled",
      metadata: files[index].metadata,
    }));
  } catch (error) {
    console.log(ERROR_TAGS.SUPABASE_STORAGE_ERROR, error);
    throw Error(formatErrorMessage(ERROR_TAGS.SUPABASE_STORAGE_ERROR, error));
  }
}
