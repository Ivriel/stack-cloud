// sidebar
//layout

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getFiles } from "@/lib/appwrite/file.actions";
import { getCurrentUser } from "@/lib/appwrite/user.actions";
import { getTotalFileSize } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { Toaster } from "sonner";

export const metadata:Metadata  = {
    title:"UpThings",
    description:"Store securely and manage freely"
}

const Layout = async({children}:{children:React.ReactNode}) => {
    const user = await getCurrentUser();

    if(!user) {
        redirect("/auth")
    }

    const files = await getFiles({types:[],query:""})
    const totalSize = getTotalFileSize(files?.rows);
    return <main className="flex h-screen overflow-hidden bg-white">
        {/* todo: pass fullName, and fileSize */}
        <Sidebar fullName={user?.fullName} fileSize={totalSize}/>
        <section className="flex h-full flex-1 flex-col min-w-0">
            <Header ownerId={user.$id} accountId={user.accountId}/>
            <div className="bg-gray-50 shadow m-4 rounded-2xl flex-1 overflow-y-auto">
                {children}
            </div>
        </section>

        <Toaster />
    </main>
}

export default Layout;