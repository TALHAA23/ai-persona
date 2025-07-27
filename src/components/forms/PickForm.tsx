import { FormSearchParams } from "@/types/types.client";
import BasicInfo from "./basic-info";
import PersonaConfig from "./persona-config";
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
    default:
      return <h1>Failed to Pick a form</h1>;
  }
}
