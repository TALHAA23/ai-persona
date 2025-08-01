import z from "zod";
import {
  BasicIdentitySchema,
  PersonaConfigurationSchema,
} from "./schemas.client";

export type FormSectionActions =
  | {
      type: "UPDATE_BASIC_IDENTITY";
      payload: z.infer<typeof BasicIdentitySchema>;
    }
  | {
      type: "UPDATE_PERSONA_CONFIGS";
      payload: z.infer<typeof PersonaConfigurationSchema>;
    }
  | { type: "TOGGLE_ACTIVE" }
  | { type: "RESET" };

export type FormSearchParams = "persona-config" | "basic";
export interface SearchParams {
  form: FormSearchParams;
}
