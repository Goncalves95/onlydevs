// Superseded by app/[locale]/(auth)/login/page.tsx
// This file must stay to avoid Next.js complaining about a missing default export
// but will never be reached because middleware redirects all non-locale paths.
import { redirect } from "next/navigation";
export default function LoginRedirect() {
  redirect("/en/login");
}
