// Superseded by app/[locale]/(store)/products/page.tsx
import { redirect } from "next/navigation";
export default function ProductsRedirect() {
  redirect("/en/products");
}
