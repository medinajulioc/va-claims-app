"use client";

import * as React from "react";
import { FormDescription } from "@/components/ui/form";
import type { ComponentProps } from "react";

/**
 * A client-only wrapper for FormDescription to prevent hydration mismatches
 * caused by browser extensions like LastPass that modify the DOM.
 */
export function ClientFormDescription(props: ComponentProps<typeof FormDescription>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Only render FormDescription on the client to avoid hydration mismatches
  if (!mounted) {
    return null;
  }

  return <FormDescription {...props} />;
}
