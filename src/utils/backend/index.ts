import { Document } from "langchain/document";
import { ErrorTag } from "../shared/CONST";
import { FileUploadSchema, UnifiedMetadata } from "@/types/schemas";
import z from "zod";
export const combineDocs = (docs: Document[]) =>
  docs.map((doc) => doc.pageContent).join("\n");

export function parseLLMJsonResponse(rawResponse: string): any {
  const cleaned = rawResponse
    .trim()
    .replace(/^```(?:json)?\s*/i, "") // remove opening ``` or ```json
    .replace(/```$/, "") // remove closing ```
    .replace(/^\uFEFF/, ""); // remove invisible BOM character

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse LLM response:", err);
    throw new Error("Invalid JSON format from LLM.");
  }
}

export function resolvePersonaCreationData(data: FormData) {
  const metadataRaw = data.get("file_uploads_metadata");

  const metadata =
    !(metadataRaw instanceof File) &&
    !metadataRaw &&
    typeof metadataRaw === "string" &&
    metadataRaw.trim() !== ""
      ? JSON.parse(metadataRaw)
      : undefined;

  const file_uploads = data
    .getAll("file_uploads")
    .filter((f): f is File => f instanceof File)
    .map((file: File, index) => ({
      file,
      metadata: createMetadataFromFile(
        `${file.name}-${Date.now()}`,
        metadata[index]
      ),
    }));

  // form sections
  const form_sections = data
    .getAll("form_sections")
    .map((section) => JSON.parse(section.toString()))
    .map((section) => ({
      ...section,
      metadata: createMetadataFromForm(section.section_name, section.data),
    }));

  // ! mock identifaction
  data.set("user_id", "2af2125c-a2ed-4ebc-80f1-ef8c509b6a16");

  const base: Record<string, any> = Object.fromEntries(data.entries());
  Array.from(Object.entries(base)).map(([key, value]) => {
    if (
      typeof value == "string" &&
      (value.startsWith("{") || value.startsWith("["))
    ) {
      const parsedValue = JSON.parse(value);
      base[key] = parsedValue;
    }
  });

  return file_uploads.length
    ? { ...base, file_uploads, form_sections }
    : { ...base, form_sections };
}

export function formatErrorMessage(tag: ErrorTag, error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : JSON.stringify(error);

  return `${tag} ${message}`;
}

// Helper to create metadata from form section
export function createMetadataFromForm(
  // sectionId: string,
  sectionName: string,
  formData: Record<string, any>,
  userMetadata: Partial<UnifiedMetadata> = {}
): UnifiedMetadata {
  // ! Mock identification
  const {
    user_id = "2af2125c-a2ed-4ebc-80f1-ef8c509b6a16",
    persona_id = "example-persona",
  } = userMetadata;
  if (!(user_id && persona_id)) {
    throw Error("Missing UserID or PersonaID while generating metadata.");
  }

  return {
    user_id: user_id as string,
    persona_id: persona_id as string,
    source_type: "form",
    source_id: sectionName,
    category: userMetadata.category || "other",
    title: userMetadata.title || sectionName,
    description: userMetadata.description || `Form data from ${sectionName}`,
    content_type: userMetadata.content_type || "factual",
    topics: userMetadata.topics || [sectionName],
    keywords: userMetadata.keywords || Object.keys(formData),
    tags: userMetadata.tags || [sectionName],
    temporal_context: {
      is_current: true,
      is_historical: false,
      ...userMetadata.temporal_context,
    },
    importance: userMetadata.importance || "medium",
    confidence_level: userMetadata.confidence_level || 1,
    // privacy_level: userMetadata.privacy_level || "private",
    context_notes: userMetadata.context_notes,
    relevance_scope: userMetadata.relevance_scope,
    audience_tags: userMetadata.audience_tags,
    processing_info: {
      created_at: new Date(),
      updated_at: new Date(),
    },
  };
}

// Helper to create metadata from file
export function createMetadataFromFile(
  fileId: string,
  fileMetadata: z.infer<typeof FileUploadSchema>["metadata"],
  chunkIndex?: number,
  totalChunks?: number
): UnifiedMetadata {
  // ! Mock identifcation
  const {
    user_id = "2af2125c-a2ed-4ebc-80f1-ef8c509b6a16",
    persona_id = "example persona",
  } = fileMetadata;
  if (!(user_id && persona_id)) {
    throw Error("Missing UserID or PersonaID while generating metadata.");
  }
  return {
    ...fileMetadata,
    user_id: user_id as string,
    persona_id: persona_id as string,
    category: fileMetadata.category || "other",
    source_type: "file",
    source_id: fileId,
    temporal_context: {
      is_current:
        !fileMetadata.temporal_context.time_period ||
        fileMetadata.temporal_context.time_period.includes("current"),
      is_historical: Boolean(
        fileMetadata.temporal_context.time_period &&
          !fileMetadata.temporal_context.time_period.includes("current")
      ),
      time_period: fileMetadata.temporal_context.time_period,
    },
    confidence_level: 1, // Files are assumed to be fully accurate
    // privacy_level: "private", // Default for files
    processing_info: {
      created_at: new Date(),
      updated_at: new Date(),
      chunk_index: chunkIndex,
      total_chunks: totalChunks,
    },
  };
}
