"use client";

import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { mockData } from "@/app/lib/statement-generator/mockData";

interface MockDataLoaderProps {
  formType: "21-0781" | "21-10210" | "21-4138";
}

export function MockDataLoader({ formType }: MockDataLoaderProps) {
  const { setValue } = useFormContext();

  // Only show in development environment
  if (process.env.NODE_ENV !== "development") return null;

  const loadMockData = () => {
    const data = mockData[formType];
    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={loadMockData}
      className="mt-4 text-xs"
      size="sm">
      Load Mock Data (Dev Only)
    </Button>
  );
}
