import uploadFiles from "./uploadFiles";
import { supabaseClient } from "./supabase-client";
import { formatErrorMessage } from "@/utils/backend";
import { ERROR_TAGS } from "@/utils/shared/CONST";

export default async function readFiles(
  userId: string,
  personaId: string,
  files: Awaited<ReturnType<typeof uploadFiles>>
) {
  try {
    const promises = files
      .filter((file) => file.success)
      .map(async ({ filename }, index) => {
        const path = `${userId}/${personaId}/${filename}`;
        console.log("Downloading from path:", path);

        const { data, error } = await supabaseClient.storage
          .from("files")
          .download(path);

        if (error || !data) {
          console.log(error);
          throw new Error(error?.message || "Failed to download file");
        }

        const text = await data.text();
        return { text, metadata: files[index].metadata };
      });

    const results = await Promise.allSettled(promises);
    return results
      .filter((result) => result.status == "fulfilled")
      .map((result) => result.value);
  } catch (error) {
    console.log(ERROR_TAGS.SUPABASE_STORAGE_ERROR, error);
    throw Error(formatErrorMessage(ERROR_TAGS.SUPABASE_STORAGE_ERROR, error));
  }
}
