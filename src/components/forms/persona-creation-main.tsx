"use client";
import { FormSearchParams } from "@/types/types.client";
import PickedForm from "./PickForm";

export default function PersonaCreationForms({
  currentForm,
}: {
  currentForm: FormSearchParams;
}) {
  return (
    <div>
      <PickedForm currentForm={currentForm} />
    </div>
  );
}
