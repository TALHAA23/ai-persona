export type FormSectionActions =
  | { type: "SET_NAME"; payload: string }
  | { type: "TOGGLE_ACTIVE" }
  | { type: "RESET" };

export type FormSearchParams = "persona-config" | "basic";
export interface SearchParams {
  form: FormSearchParams;
}
