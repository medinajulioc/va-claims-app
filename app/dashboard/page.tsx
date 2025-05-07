import { generateMeta } from "@/lib/utils";
import AppRender from "@/app/dashboard/app-render";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "VA Claims Research Assistant",
    description:
      "An intelligent research tool for veterans filing disability claims. Ask questions, get guidance, and find information to support your VA disability claim.",
    canonical: "/dashboard"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">VA Claims Research Assistant</h1>
        <div className="flex items-center space-x-2">
          <Button>
            <Download />
            <span className="hidden lg:inline">Download Reports</span>
          </Button>
        </div>
      </div>
      <div className="gap-4 space-y-4">
        <AppRender />
      </div>
    </div>
  );
} 