import { FormSearchParams } from "@/types/types.client";
import BasicInfo from "./basic-info";
import PersonaConfig from "./persona-config";
import CultureAndLanguageBackground from "./culture-language-background";
import PersonalityAndBeliefs from "./personality-and-beliefs";
import EducationBackground from "./education-background";
import { FORM_NAVIGATION_SEQUENCE } from "@/utils/shared/CONST";
import FileUploads from "./files-uploads";
export default function PickedForm({
  currentForm,
}: {
  currentForm: FormSearchParams;
}) {
  const { FORM1, FORM2, FORM3, FORM4, FORM5, FORM6 } = FORM_NAVIGATION_SEQUENCE;
  switch (currentForm) {
    case "persona-config":
      return <PersonaConfig next={FORM2} />;
    case "basic":
      return <BasicInfo prev={FORM1} next={FORM3} />;
    case "personality-and-beliefs":
      return <PersonalityAndBeliefs prev={FORM2} next={FORM4} />;
    case "culture-and-language-background":
      return <CultureAndLanguageBackground prev={FORM3} next={FORM5} />;
    case "education-background":
      return <EducationBackground prev={FORM4} next={FORM6} skippable={true} />;
    case "files":
      return <FileUploads prev={FORM5} next="basic" skippable={true} />;
    default:
      return <h1>Failed to Pick a form</h1>;
  }
}
