import { z } from "zod";
import {
  CategoriesEnum,
  ContentTypeEnum,
  ImportanceEnum,
  PersonaToneEnum,
  PersonaTypeEnum,
  PrivacyLevelEnum,
  QueryIntentEnum,
  RoleEnum,
} from "./enums";

export const ChatMessageSchema = z.object({
  role: RoleEnum,
  content: z.string(),
});

// Single source of truth for all metadata
export const UnifiedMetadataSchema = z.object({
  // Core identification
  user_id: z.string(),
  persona_id: z.string(),
  source_type: z.enum(["form", "file"]),
  source_id: z.string(), // form section ID or file ID
  category: CategoriesEnum,

  // Content classification
  content_type: ContentTypeEnum,
  topics: z.array(z.string()),
  keywords: z.array(z.string()),
  tags: z.array(z.string()),

  // Temporal context
  temporal_context: z.object({
    time_period: z.string().optional(),
    is_current: z.boolean().default(true),
    is_historical: z.boolean().default(false),
    valid_from: z.date().optional(),
    valid_until: z.date().optional(),
  }),

  // Importance and usage
  importance: ImportanceEnum,
  confidence_level: z.number().min(0).max(1).default(1),
  // privacy_level: z.enum(["public", "private", "selective"]).default("private"),

  // Context and description
  title: z.string(),
  description: z.string().nonempty(),
  context_notes: z.string().optional(),

  // Query optimization
  relevance_scope: z.array(z.string()).optional(), // When to surface this info
  audience_tags: z.array(z.string()).optional(), // Who should see this

  // Processing metadata
  processing_info: z
    .object({
      created_at: z.date(),
      updated_at: z.date(),
      chunk_index: z.number().optional(), // For file chunks
      total_chunks: z.number().optional(), // Total chunks from this source
    })
    .optional(),
});

export type UnifiedMetadata = z.infer<typeof UnifiedMetadataSchema>;

export const ChunkDocumentSchema = z.object({
  pageContent: z.string(),
  metadata: UnifiedMetadataSchema,
});
export const ChunkDocumentsSchema = z.array(ChunkDocumentSchema);

//! Chunk Schema (what gets stored in your vector DB)
export const ChunkSchema = z.object({
  chunk_id: z.string(),
  persona_id: z.string(),
  content: z.string(), // The actual text content
  embedding: z.array(z.number()).optional(), // Vector embedding
  metadata: UnifiedMetadataSchema, // Same metadata for all chunks
});

// Form Section Schema
export const FormSectionSchema = z.object({
  section_id: z.string(),
  section_name: z.string(),
  is_completed: z.boolean(),
  data: z.record(z.any()),
  metadata: UnifiedMetadataSchema.omit({
    source_type: true, // We'll add this programmatically
    source_id: true,
    persona_id: true,
    user_id: true,
  }),
});

// File Upload Schema
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  metadata: UnifiedMetadataSchema,
});

export const FileUploadArraySchema = z.array(FileUploadSchema);

export const PersonaCreationInputSchema = z.object({
  user_id: z.string(),
  persona_name: z.string(),
  persona_description: z.string().optional(),

  form_sections: z.array(FormSectionSchema),
  file_uploads: FileUploadArraySchema.optional(),

  global_settings: z.object({
    default_tone: PersonaToneEnum.optional().default("friendly"),
    default_persona_type: PersonaTypeEnum.optional().default("adaptive"),
    privacy_level: PrivacyLevelEnum.optional().default("public"),
    language: z.string().optional().default("en"),
  }),
});

export const FileMetadataInputSchema = z.object({
  file_id: z.string(),
  persona_id: z.string(),
  title: z.string(),
  description: z.string(),

  content_classification: z.object({
    primary_type: ContentTypeEnum,
    secondary_types: z.array(ContentTypeEnum).optional(),
    confidence: z.number(),
  }),

  topics: z.array(
    z.object({
      topic: z.string(),
      relevance: z.number(),
      subtopics: z.array(z.string()).optional(),
    })
  ),

  keywords: z.array(z.string()),

  temporal_info: z.object({
    time_period: z.string().optional(),
    specific_dates: z
      .object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
      .optional(),
    is_current: z.boolean(),
    is_historical: z.boolean(),
  }),

  usage_context: z.object({
    when_to_use: z.array(z.string()),
    importance_level: ImportanceEnum,
    privacy_level: PrivacyLevelEnum,
    audience_tags: z.array(z.string()).optional(),
  }),

  custom_tags: z.array(z.string()),
  notes: z.string().optional(),
});

export const QueryAnalysisInputSchema = z.object({
  user_message: z.string(),
  persona_id: z.string(),
  conversation_context: z
    .object({
      previous_messages: z.array(z.string()).optional(),
      conversation_topic: z.string().optional(),
      user_intent: z.string().optional(),
    })
    .optional(),
});

export const QueryAnalysisOutputSchema = z.object({
  analysis_id: z.string(),
  timestamp: z.date(),

  query_intent: z.object({
    primary_intent: QueryIntentEnum,
    secondary_intents: z.array(QueryIntentEnum).optional(),
    confidence: z.number().min(0).max(1),
  }),

  // Search filters using the same metadata fields
  search_filters: z.object({
    topics: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    content_types: z.array(ContentTypeEnum).optional(),
    importance_threshold: ImportanceEnum.optional(),
    temporal_requirements: z
      .object({
        prefer_current: z.boolean().default(false),
        prefer_historical: z.boolean().default(false),
        specific_time_period: z.string().optional(),
      })
      .optional(),
    relevance_scope: z.array(z.string()).optional(),
    min_confidence: z.number().min(0).max(1).optional(),
  }),

  search_keywords: z.array(z.string()),
  recommended_response_style: z.object({
    tone: PersonaToneEnum,
    length: z.enum(["short", "medium", "long"]),
    include_examples: z.boolean(),
    include_personal_touch: z.boolean(),
  }),
});
