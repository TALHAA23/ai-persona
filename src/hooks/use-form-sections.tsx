"use client";
import React, { createContext, useContext, ReactNode } from "react";

const FormSectionsContext = createContext<undefined>(undefined);

const FormSectionsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FormSectionsContext.Provider value={undefined}>
      {children}
    </FormSectionsContext.Provider>
  );
};

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
