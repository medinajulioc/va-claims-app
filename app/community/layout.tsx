"use client";

import { ReactNode } from "react";
import { CommunityProvider } from "./lib/community-provider";

interface CommunityLayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return <div className="bg-background min-h-screen">{children}</div>;
}
