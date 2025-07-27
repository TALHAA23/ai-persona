import PersonaCreationForms from "@/components/forms/persona-creation-main";
import { SearchParams } from "@/types/types.client";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  return <PersonaCreationForms currentForm={query.form} />;
}
