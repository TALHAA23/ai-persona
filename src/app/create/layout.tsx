import FormSectionsProvider from "@/hooks/use-form-sections";

export default async function FormsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <FormSectionsProvider>{children}</FormSectionsProvider>;
}
