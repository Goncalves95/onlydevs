import { redirect } from "next/navigation";
import { routing } from "@/lib/i18n/routing";

// Redirect bare / to the default locale
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
