"use client";
import { FormSectionsSchema } from "@/types/schemas.client";
import { FormSectionActions } from "@/types/types.client";
import React, { createContext, useContext, ReactNode, useReducer } from "react";
import z from "zod";

type FormSectionsContextType = z.infer<typeof FormSectionsSchema>;

// Allow partial updates
type PartialFormSectionsState = Partial<FormSectionsContextType>;

// Context allows this flexible structure
const FormSectionsContext = createContext<{
  state: PartialFormSectionsState;
  dispatch: React.Dispatch<FormSectionActions>;
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

    default:
      return state;
  }
};

// Start with empty object (not null)
const FormSectionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {});
  console.log(state);

  return (
    <FormSectionsContext.Provider value={{ state, dispatch }}>
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
