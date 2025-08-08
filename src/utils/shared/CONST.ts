import { FormSearchParams } from "@/types/types.client";

export const ERROR_TAGS = {
  LANGCHAIN_ERROR: "LANGCHAIN_ERROR",
  LANGCHAIN_CHUNKING_ERROR: "LANGCHAIN_CHUNKING_ERROR",
  LANGCHAIN_SPLIT_ERROR: "LANGCHAIN_SPLIT_ERROR",
  OPENAI_API_ERROR: "OPENAI_API_ERROR",
  VECTOR_DB_ERROR: "VECTOR_DB_ERROR",
  FILE_READ_ERROR: "FILE_READ_ERROR",
  ENV_CONFIG_ERROR: "ENV_CONFIG_ERROR",
  API_REQUEST_ERROR: "API_REQUEST_ERROR",
  INPUT_VALIDATION_ERROR: "INPUT_VALIDATION_ERROR",
  SUPABASE_STORAGE_ERROR: "SUPABASE_STORAGE_ERROR",
} as const;

export type ErrorTag = keyof typeof ERROR_TAGS;
export const GEMINI_MODELS = {
  CHAT_MODEL: "gemini-2.0-flash",
  EMBEDDING_MODEL: "text-embedding-004",
};
export const SUPABASE_TABLES = {
  AI_PERSONA: "ai_persona",
  EMBEDDINGS: "ai_embeddings",
};

export const ANIMEJS_ANIMATION_CLASSES = {
  WORDS_ANIMATIONS: {
    SLIDE_DOWN: "animate-word-slide-down",
  },
  FORM_FIELD_SHOWING: "animated-field-showing",
  CONTAINERS_ANIMATION: {
    SLIDE_UP: "animate-container-slide-up",
  },
};

export const API_ENDPOINTS = {
  CREATE_PERSONA: "/api/persona/upload",
};

export const FORM_NAVIGATION_SEQUENCE: Record<string, FormSearchParams> = {
  FORM1: "persona-config",
  FORM2: "basic",
  FORM3: "personality-and-beliefs",
  FORM4: "culture-and-language-background",
  FORM5: "education-background",
  FORM6: "files",
  LAST: "submission",
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_TYPES = ["text/plain", "text/markdown"];
export const ALLOWED_EXTENSIONS = ["txt", "md"];
