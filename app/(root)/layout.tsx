import Header from "@/components/Header";
import AppSidebar from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getFiles } from "@/lib/appwrite/file.actions";
import { getCurrentUser } from "@/lib/appwrite/user.actions";
import { getTotalFileSize } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "UpThings",
  description: "Store securely and manage freely",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const files = await getFiles({ types: [], query: "" });
  const totalSize = getTotalFileSize(files?.rows);

  const totalBytes: number =
    files?.rows?.reduce(
      (acc: number, f: { size: number }) => acc + (f.size ?? 0),
      0
    ) ?? 0;
  const MAX_BYTES = 2 * 1000 * 1000 * 1000; // Appwrite free tier = 2 GB
  const usedPercent = Math.min(Math.round((totalBytes / MAX_BYTES) * 100), 100);

  return (
    <SidebarProvider>
      <AppSidebar
        fullName={user?.fullName}
        fileSize={totalSize}
        usedPercent={usedPercent}
      />
      <SidebarInset className="flex flex-col h-screen overflow-hidden bg-white">
        <Header ownerId={user.$id} accountId={user.accountId} />
        <div className="bg-gray-50 m-4 mt-3 rounded-2xl flex-1 overflow-y-auto shadow-sm">
          {children}
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
