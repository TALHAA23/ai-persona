"use client";
import { FormSectionsSchema } from "@/types/schemas.client";
import { FormSectionActions } from "@/types/types.client";
import React, { createContext, useContext, ReactNode, useReducer } from "react";
import z from "zod";

// 1. Define the full state type
type FormSectionsContextType = z.infer<typeof FormSectionsSchema>;

// 2. Initial state can be null (lazy start)
type NullableFormSectionsState = FormSectionsContextType | null;

// 3. Provide correct context
const FormSectionsContext = createContext<{
  state: NullableFormSectionsState;
  dispatch: React.Dispatch<FormSectionActions>;
} | null>(null);

// 4. Reducer must handle null state
const reducer = (
  state: NullableFormSectionsState,
  action: FormSectionActions
): NullableFormSectionsState => {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        basicIdentity: {
          age: 29,
          full_name: "some name",
          nationality: "pk",
          gender: "male",
        },
      };

    default:
      return state;
  }
};

// 5. Provider component
const FormSectionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, null);

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
