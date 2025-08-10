"use client";
import { FormsDataSchema } from "@/types/schemas.client";
import { FormSectionActions } from "@/types/types.client";
import { API_ENDPOINTS } from "@/utils/shared/CONST";
import React, { createContext, useContext, ReactNode, useReducer } from "react";
import z from "zod";

type FormSectionsContextType = z.infer<typeof FormsDataSchema>;

// Allow partial updates
type PartialFormSectionsState = Partial<FormSectionsContextType>;

// Context allows this flexible structure
const FormSectionsContext = createContext<{
  state: PartialFormSectionsState;
  dispatch: React.Dispatch<FormSectionActions>;
  submit: () => void;
} | null>(null);

// Reducer allows updates to partial sections
const reducer = (
  state: PartialFormSectionsState,
  action: FormSectionActions
): PartialFormSectionsState => {
  switch (action.type) {
    case "UPDATE_BASIC_IDENTITY":
      return { ...state, basicIdentity: action.payload };

    case "UPDATE_PERSONA_CONFIGS":
      return { ...state, personaConfigs: action.payload };
    case "UPATE_CULTURE_AND_LANGUAGE_BACKGROUND":
      return { ...state, cultureAndLanguageBackground: action.payload };
    case "UPDATE_PERSONALITY_AND_BELIEFS":
      return { ...state, personalityAndBeliefs: action.payload };
    case "UPDATE_EDUCATION_BACKGROUND":
      return { ...state, educationBackground: action.payload };
    case "UPDATE_FILES":
      return { ...state, files: action.payload };
    default:
      return state;
  }
};

// Start with empty object (not null)
const FormSectionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {});

  const submit = async () => {
    console.log("data", state);
    const formdata = new FormData();

    // file form
    formdata.set(
      "file_uploads_metadata",
      JSON.stringify(state.files?.file_uploads_metadata)
    );
    state.files?.file_uploads?.forEach((file) => {
      formdata.append("file_uploads", file);
    });

    // persona configs form
    const { global_settings, persona_description, persona_name } =
      state?.personaConfigs || {};
    formdata.set("global_settings", JSON.stringify(global_settings));
    formdata.set("persona_description", persona_description || "");
    formdata.set("persona_name", persona_name || "");

    delete state.files;
    delete state.personaConfigs;

    // form sections
    Object.values(state).forEach((item) => {
      formdata.append("form_sections", JSON.stringify(item));
    });

    console.log([...formdata.entries()]);
    const response = await fetch(API_ENDPOINTS.CREATE_PERSONA, {
      method: "POST",
      body: formdata,
    });
    console.log(response);
  };

  return (
    <FormSectionsContext.Provider value={{ state, dispatch, submit }}>
      {children}
    </FormSectionsContext.Provider>
  );
};

// 6. Hook to consume
export const useFormSections = () => {
  const context = useContext(FormSectionsContext);
  if (!context) {
    throw new Error(
      "useFormSections must be used within a FormSectionsProvider"
    );
  }
  return context;
};

export default FormSectionsProvider;
