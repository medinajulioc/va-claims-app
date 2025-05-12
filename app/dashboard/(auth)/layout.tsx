import React from "react";
import { Toaster } from "@/components/ui/sonner";

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="@container/main p-4 pb-0 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto xl:group-data-[theme-content-layout=centered]/layout:mt-8">
        {children}
      </div>
      <Toaster position="top-center" />
    </>
  );
}
