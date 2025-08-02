import z from "zod";
import {
  GenderEnums,
  LanguageProficiencyEnum,
  PersonaToneEnum,
  PersonaTypeEnum,
  PrivacyLevelEnum,
} from "./enums";

export const BasicIdentitySchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  age: z.coerce.number().int().min(1).max(120),
  gender: GenderEnums,
  nationality: z.string(),

  ethnicity: z.string().optional(),
  preferred_pronouns: z.string().optional(),
  date_of_birth: z.string().optional(), // ISO format
  current_location: z.string().optional(),
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
  native_language: z.string().nonempty(),
  other_languages: z.array(z.string()).default([]),
  religion: z.string().default("none"),
  cultural_identity: z.string(),

  language_proficiency: z.record(LanguageProficiencyEnum).optional(),

  accents_or_dialects: z.array(z.string()).optional(),
  festivals_celebrated: z.array(z.string()).optional(),
  customs_or_norms: z.array(z.string()).optional(),
  cultural_references: z.array(z.string()).optional(),
});

export const FormSectionsSchema = z.object({
  basicIdentity: BasicIdentitySchema,
  personaConfigs: PersonaConfigurationSchema,
  cultureAndLanguageBackground: CulturalLanguageBackgroundSchema,
});
