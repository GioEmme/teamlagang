import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardTopbar } from "@/components/DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardTopbar
        firstName={session.user.firstName}
        lastName={session.user.lastName}
        role={session.user.role}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
