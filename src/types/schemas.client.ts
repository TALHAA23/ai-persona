import z from "zod";
import { GenderEnums } from "./enums";

export const BasicIdentitySchema = z.object({
  full_name: z.string().min(2),
  age: z.number().int().min(1).max(120),
  gender: GenderEnums,
  nationality: z.string(),

  ethnicity: z.string().optional(),
  preferred_pronouns: z.string().optional(),
  date_of_birth: z.string().optional(), // ISO format
  current_location: z.string().optional(),
});

export const FormSectionsSchema = z.object({
  basicIdentity: BasicIdentitySchema,
});
