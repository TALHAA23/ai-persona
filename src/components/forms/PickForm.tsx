import { FormSearchParams } from "@/types/types.client";
import BasicInfo from "./basic-info";
import PersonaConfig from "./persona-config";
import CultureAndLanguageBackground from "./culture-language-background";
export default function PickedForm({
  currentForm,
}: {
  currentForm: FormSearchParams;
}) {
  switch (currentForm) {
    case "persona-config":
      return <PersonaConfig />;
    case "basic":
      return <BasicInfo />;
    case "culture-and-language-background":
      return <CultureAndLanguageBackground />;
    default:
      return <h1>Failed to Pick a form</h1>;
  }
}
