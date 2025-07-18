import { ERROR_TAGS } from "@/utils/shared/CONST";
import { supabaseClient } from "./supabase-client";
import uploadFiles from "./uploadFiles";
import { formatErrorMessage } from "@/utils/backend";
import pdfParse from "pdf-parse";

export default async function readFiles(
  userId: string,
  personaId: string,
  files: Awaited<ReturnType<typeof uploadFiles>>
) {
  try {
    const promises = files
      .filter((file) => file.success)
      .map(async ({ filename }) => {
        const path = `${userId}/${personaId}/${filename}`;
        console.log(path);
        const { data, error } = await supabaseClient.storage
          .from("files")
          .download(path);
        if (error) {
          console.log(error);
          throw new Error(error.message);
        }
        const buffer = await data.arrayBuffer();
        return await pdfParse(Buffer.from(buffer));
      });

    const results = await Promise.allSettled(promises);
    console.log(results);
  } catch (error) {
    console.log(ERROR_TAGS.SUPABASE_STORAGE_ERROR, error);
    throw Error(formatErrorMessage(ERROR_TAGS.SUPABASE_STORAGE_ERROR, error));
  }
}
