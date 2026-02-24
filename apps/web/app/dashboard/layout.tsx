import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar user={session?.user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Dashboard" user={session?.user} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
