import { AppNav } from "@/components/layout/app-nav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AppNav />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
