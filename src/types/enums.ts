import { z } from "zod";

export const RoleEnum = z.enum(["user", "model"]);
export const CategoriesEnum = z.enum(["work", "hobbies", "personal", "other"]);
export const ImportanceEnum = z.enum(["low", "medium", "high"]);
export const PrivacyLevelEnum = z.enum(["public", "private", "selective"]);
export const RecommendedLengthEnum = z.enum(["short", "medium", "long"]);
export const LanguageProficiencyEnum = z.enum([
  "basic",
  "intermediate",
  "fluent",
  "native",
]);

export const ContentTypeEnum = z.enum([
  "narrative",
  "factual",
  "opinion",
  "instruction",
  "reference",
  "mixed",
]);

export const PersonaToneEnum = z.enum([
  "formal",
  "casual",
  "friendly",
  "professional",
  "humorous",
  "empathetic",
  "conversational",
  "adaptive",
]);

export const PersonaTypeEnum = z.enum([
  "mentor",
  "friend",
  "professional",
  "teacher",
  "advisor",
  "storyteller",
  "creative",
  "adaptive",
]);

export const QueryIntentEnum = z.enum([
  "personal_info",
  "work_experience",
  "skills_expertise",
  "opinions_beliefs",
  "experiences_stories",
  "current_status",
  "goals_aspirations",
  "relationships",
  "hobbies_interests",
  "advice_guidance",
  "general_chat",
]);

export const PersonalityTypeEnum = z.enum([
  "introvert",
  "extrovert",
  "ambivert",
]);

export const EmotionalExpressionLevelEnum = z.enum([
  "reserved",
  "balanced",
  "expressive",
]);

export const FormalityLevelEnum = z.enum(["formal", "semi-formal", "casual"]);
export const ResponseLengthEnum = z.enum(["short", "medium", "detailed"]);
export const EmojiUseFrequencey = z.enum(["never", "sometimes", "frequently"]);
export const SectionNames = z.enum([
  "basic-identity",
  "culture-and-language-background",
  "personality-and-beliefs",
  "education-background",
]);

export const GenderEnums = z.enum(["male", "female", "prefer_not_to_say"]);
