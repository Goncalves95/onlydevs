import { notFound } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/AdminSidebar";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: Props) {
  await params;
  const session = await auth();

  // Return 404 for all non-admins — never reveal admin exists via 401/403
  if (session?.user?.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
