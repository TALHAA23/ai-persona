import { PersonaCreationInputSchema } from "@/types/schemas";
import z from "zod";

export default function formSectionDataToString(
  data: z.infer<typeof PersonaCreationInputSchema>["form_sections"]
) {
  return data.map((item) =>
    Object.entries(item.data)
      .map(([key, value]) => `${key}: ${value} \n`)
      .join("")
  );
}
