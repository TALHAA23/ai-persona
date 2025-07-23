import { z } from "zod";

export const RoleEnum = z.enum(["user", "model"]);
export const CategoriesEnum = z.enum(["work", "hobbies", "personal", "other"]);
export const ImportanceEnum = z.enum(["low", "medium", "high"]);
export const PrivacyLevelEnum = z.enum(["public", "private", "selective"]);
export const RecommendedLengthEnum = z.enum(["short", "medium", "long"]);

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
