import z from "zod";
import { BasicIdentitySchema } from "./schemas.client";

export type FormSectionActions =
  | {
      type: "UPDATE_BASIC_IDENTITY";
      payload: z.infer<typeof BasicIdentitySchema>;
    }
  | { type: "TOGGLE_ACTIVE" }
  | { type: "RESET" };

export type FormSearchParams = "persona-config" | "basic";
export interface SearchParams {
  form: FormSearchParams;
}
