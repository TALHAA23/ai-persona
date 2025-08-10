import z from "zod";
import {
  EmojiUseFrequencey,
  EmotionalExpressionLevelEnum,
  FormalityLevelEnum,
  GenderEnums,
  LanguageProficiencyEnum,
  PersonalityTypeEnum,
  PersonaToneEnum,
  PersonaTypeEnum,
  PrivacyLevelEnum,
  ResponseLengthEnum,
  SectionNames,
} from "./enums";
import { UnifiedMetadataSchema } from "./schemas";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_TYPES,
  MAX_FILE_SIZE,
} from "@/utils/shared/CONST";

export const BasicIdentitySchema = z.object({
  section_name: SectionNames.optional().default("basic-identity"),
  data: z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    age: z.coerce.number().int().min(1).max(120),
    gender: GenderEnums,
    nationality: z.string(),

    ethnicity: z.string().optional(),
    preferred_pronouns: z.string().optional(),
    date_of_birth: z.string().optional(), // ISO format
    current_location: z.string().optional(),
  }),
});

const coerceEmptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);

export const PersonaConfigurationSchema = z.object({
  persona_name: z.string().nonempty(),
  persona_description: z.string().optional(),
  global_settings: z.object({
    default_tone: coerceEmptyToUndefined(
      PersonaToneEnum.optional().default("friendly")
    ),
    default_persona_type: coerceEmptyToUndefined(
      PersonaTypeEnum.optional().default("adaptive")
    ),
    privacy_level: coerceEmptyToUndefined(
      PrivacyLevelEnum.optional().default("public")
    ),
    language: coerceEmptyToUndefined(z.string().optional().default("en")),
  }),
});

export const CulturalLanguageBackgroundSchema = z.object({
  section_name: SectionNames.optional().default(
    "culture-and-language-background"
  ),
  data: z.object({
    native_language: z.string().nonempty(),
    other_languages: z.array(z.string()).default([]),
    religion: z.string().default("none"),
    cultural_identity: z.string(),

    language_proficiency: z.record(LanguageProficiencyEnum).optional(),

    accents_or_dialects: z.array(z.string()).optional(),
    festivals_celebrated: z.array(z.string()).optional(),
    customs_or_norms: z.array(z.string()).optional(),
    cultural_references: z.array(z.string()).optional(),
  }),
});

export const PersonalityAndBeliefsSchema = z.object({
  section_name: SectionNames.optional().default("personality-and-beliefs"),
  data: z.object({
    communication_style: z.string(), // or z.enum([...])
    core_values: z.array(z.string()).min(1),
    default_tone: PersonaToneEnum,
    introvert_or_extrovert: PersonalityTypeEnum,

    humor_style: z.string().optional(),
    belief_system: z.string().optional(),
    political_view: z.string().optional(),
    emotional_expression_level: coerceEmptyToUndefined(
      EmotionalExpressionLevelEnum.optional()
    ),
    sensitive_topics_to_avoid: z.array(z.string()).optional(),
    personality_traits: z.array(z.string()).optional(),
  }),
});

export const AIChatbotPreferencesSchema = z.object({
  persona_type: PersonaTypeEnum,
  response_tone: PersonaToneEnum,
  formality_level: FormalityLevelEnum,
  allowed_topics: z.array(z.string()).default([]),
  disallowed_topics: z.array(z.string()).default([]),

  signature_phrases: z.array(z.string()).optional(),
  preferred_length: ResponseLengthEnum.optional(),
  reply_style_examples: z
    .array(
      z.object({
        user: z.string(),
        chatbot: z.string(),
      })
    )
    .optional(),
  emoji_usage: EmojiUseFrequencey.optional(),
  name_as_referred_to: z.string().optional(),
});

export const EducationHistoryItemSchema = z.object({
  degree: z.string().nonempty(),
  field: z.string().nonempty(),
  institution: z.string().nonempty(),
  year: z.coerce.number().nonnegative().min(1900),
  grade: z.string().optional(),
});

export const EducationBackgroundSchema = z.object({
  highest_degree: z.string().nonempty(),
  field_of_study: z.string().nonempty(),
  institution_name: z.string().nonempty(),
  graduation_year: z.coerce.number(),

  gpa_or_grade: z.string().optional(),
  education_history: z.array(EducationHistoryItemSchema).optional(),

  academic_achievements: z.array(z.string()).optional(),
  favorite_subjects: z.array(z.string()).optional(),
  learning_style: z.string().optional(),
  academic_interests: z.array(z.string()).optional(),
});

export const FileUploadMetaDataItemSchema = UnifiedMetadataSchema.extend({
  source_type: z.string().default("file"),
  temporal_context: UnifiedMetadataSchema.shape.temporal_context.extend({
    is_current: z
      .string()
      .optional()
      .transform((val) => (typeof val === "string" ? val === "on" : !!val)),
    is_historical: z
      .string()
      .optional()
      .transform((val) => (typeof val === "string" ? val == "on" : !!val)),
  }),
}).omit({ user_id: true });

export const ClientFileUploadsSchema = z.object({
  file_uploads: z
    .array(z.instanceof(File))
    .default([])
    .refine(
      (files) =>
        files.every((file) => {
          const typeValid =
            ALLOWED_TYPES.includes(file.type) ||
            ALLOWED_EXTENSIONS.includes(file.name.split(".").pop() || "");

          const sizeValid = file.size <= MAX_FILE_SIZE;
          return typeValid && sizeValid;
        }),
      {
        message: "Only .txt or .md files under 5MB are allowed.",
      }
    )
    .optional(),

  file_uploads_metadata: z.array(FileUploadMetaDataItemSchema),
});

export const FormsDataSchema = z.object({
  basicIdentity: BasicIdentitySchema,
  personaConfigs: PersonaConfigurationSchema,
  cultureAndLanguageBackground: CulturalLanguageBackgroundSchema,
  personalityAndBeliefs: PersonalityAndBeliefsSchema,
  educationBackground: EducationBackgroundSchema.optional(),
  files: ClientFileUploadsSchema.optional(),
});
