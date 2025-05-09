import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { generateMeta } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return generateMeta({
    title: "404 Page",
    description:
      "The VA disability claim resource you're looking for cannot be found. Please check the URL or return to the dashboard.",
    canonical: "/pages/error/404"
  });
}

export default function Page() {
  return (
    <div className="flex h-[90vh] flex-col items-center justify-center text-center">
      <div className="mx-auto flex max-w-[600px] flex-col items-center space-y-2">
        <h1 className="text-8xl font-bold">404</h1>
        <h2 className="text-3xl font-semibold">Claim Resource Not Found</h2>
        <p className="text-muted-foreground text-balance">
          Sorry, the VA benefits information you're looking for cannot be found or may have moved.
        </p>
        <Button className="mt-4" asChild>
          <Link className="flex items-center gap-2" href="/dashboard">
            Return to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
