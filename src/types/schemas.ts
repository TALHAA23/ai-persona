import { z } from "zod";
import {
  CategoriesEnum,
  ContentTypeEnum,
  ImportanceEnum,
  PersonaToneEnum,
  PersonaTypeEnum,
  PrivacyLevelEnum,
  QueryIntentEnum,
  RecommendedLengthEnum,
  RoleEnum,
} from "./enums";

export const ChatMessageSchema = z.object({
  role: RoleEnum,
  content: z.string(),
});

export const ChunkMetadataSchema = z.object({
  persona_id: z.string(),
  section_id: z.string(),
  file_id: z.string(),
  category: CategoriesEnum,
});

export const ChunkDocumentSchema = z.object({
  pageContent: z.string(),
  metadata: ChunkMetadataSchema,
});

export const FormSectionSchema = z.object({
  section_id: z.string(),
  section_name: z.string(),
  is_completed: z.boolean(),
  data: z.record(z.any()),
  metadata: z.object({
    confidence_level: z.number().optional(),
    is_current: z.boolean().optional(),
    last_updated: z.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const FileUploadSchema = z.object({
  file_id: z.string(),
  original_filename: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  file_url: z.string(),

  user_metadata: z.object({
    title: z.string(),
    description: z.string(),
    content_type: ContentTypeEnum,
    topics: z.array(z.string()),
    keywords: z.array(z.string()),
    time_period: z.string().optional(),
    importance: ImportanceEnum,
    tags: z.array(z.string()),
    context_notes: z.string().optional(),
  }),

  processing_status: z.enum(["pending", "processing", "completed", "failed"]),
  extracted_content: z.string().optional(),
  processing_metadata: z
    .object({
      chunk_count: z.number().optional(),
      entities_extracted: z.array(z.string()).optional(),
      auto_generated_tags: z.array(z.string()).optional(),
      sentiment_score: z.number().optional(),
    })
    .optional(),
});

export const PersonaCreationInputSchema = z.object({
  user_id: z.string(),
  persona_name: z.string(),
  persona_description: z.string().optional(),

  form_sections: z.array(FormSectionSchema),
  file_uploads: z.array(FileUploadSchema),

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
    confidence: z.number(),
  }),

  required_information: z.object({
    required_topics: z.array(z.string()),
    required_tags: z.array(z.string()),
    required_content_types: z.array(ContentTypeEnum),
    temporal_requirements: z
      .object({
        prefer_current: z.boolean(),
        prefer_historical: z.boolean(),
        specific_time_period: z.string().optional(),
      })
      .optional(),
    importance_threshold: ImportanceEnum.optional(),
  }),

  search_parameters: z.object({
    query_embeddings: z.array(z.number()).optional(),
    search_keywords: z.array(z.string()),
    filter_criteria: z.object({
      topics: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      content_types: z.array(ContentTypeEnum).optional(),
      date_range: z
        .object({
          from: z.date().optional(),
          to: z.date().optional(),
        })
        .optional(),
      min_importance: ImportanceEnum.optional(),
    }),
    result_limit: z.number().optional(),
  }),

  response_style: z.object({
    recommended_tone: PersonaToneEnum,
    recommended_length: RecommendedLengthEnum,
    should_include_examples: z.boolean(),
    should_include_personal_touch: z.boolean(),
  }),
});
