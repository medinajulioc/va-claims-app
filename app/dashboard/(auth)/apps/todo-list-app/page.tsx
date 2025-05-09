import { AlertCircleIcon } from "lucide-react";
import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "VA Claims Task Checklist",
    description:
      "Track your VA disability claim tasks, required documents, and upcoming deadlines. Stay organized throughout your claims process with this comprehensive checklist tool.",
    canonical: "/apps/todo-list-app"
  });
}

export default function Page() {
  return (
    <div className="flex h-[90vh] items-center justify-center text-center">
      <div className="max-w-(--breakpoint-sm) space-y-4 lg:space-y-8">
        <h1 className="flex items-center justify-center text-3xl font-bold tracking-tight lg:text-4xl">
          <svg
            className="mr-5 h-9 w-9 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          VA Claims Task Checklist
        </h1>
        <div className="lg:text-lg">
          Keep track of required forms, evidence collection, medical appointments, and deadlines for
          your VA disability claim. Never miss a critical step in your claims process.
        </div>
        <div className="text-muted-foreground flex items-center justify-center gap-2">
          <AlertCircleIcon className="h-4 w-4 text-orange-400" />
          This feature is currently under construction.
        </div>
      </div>
    </div>
  );
}
