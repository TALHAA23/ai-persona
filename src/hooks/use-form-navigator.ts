import { FormSearchParams } from "@/types/types.client";
import { usePathname, useRouter } from "next/navigation";

export default function useFormNavigator() {
  const pathname = usePathname();
  const router = useRouter();

  const goto = (query: FormSearchParams) => {
    const url = new URLSearchParams();
    url.set("form", query);
    router.push(`${pathname}?${url.toString()}`);
  };

  return goto;
}
