import z from "zod";
import {
  BasicIdentitySchema,
  ClientFileUploadsSchema,
  CulturalLanguageBackgroundSchema,
  EducationBackgroundSchema,
  PersonaConfigurationSchema,
  PersonalityAndBeliefsSchema,
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
  | {
      type: "UPATE_CULTURE_AND_LANGUAGE_BACKGROUND";
      payload: z.infer<typeof CulturalLanguageBackgroundSchema>;
    }
  | {
      type: "UPDATE_PERSONALITY_AND_BELIEFS";
      payload: z.infer<typeof PersonalityAndBeliefsSchema>;
    }
  | {
      type: "UPDATE_EDUCATION_BACKGROUND";
      payload: z.infer<typeof EducationBackgroundSchema>;
    }
  | {
      type: "UPDATE_FILES";
      payload: z.infer<typeof ClientFileUploadsSchema>;
    };

export type FormSearchParams =
  | "persona-config"
  | "basic"
  | "culture-and-language-background"
  | "personality-and-beliefs"
  | "education-background"
  | "files";

export interface SearchParams {
  form: FormSearchParams;
}

export interface PersonaCreationFormProps {
  prev?: FormSearchParams;
  next?: FormSearchParams;
  skippable?: boolean;
}
