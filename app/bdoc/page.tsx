import { generateMeta } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "VA Claims Dashboard",
    description:
      "The VA Claims dashboard provides tools for managing and analyzing veterans' benefits documentation.",
    canonical: "/bdoc"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">VA Benefits Documentation</h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Welcome to VA Benefits Documentation</h2>
            <p className="mt-2 text-muted-foreground">
              This dashboard helps veterans organize and manage their claims documentation. Use the
              tabs above to navigate through different sections.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-medium">Recent Claims</h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">No recent claims</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-medium">Document Status</h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">No documents uploaded</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-medium">Upcoming Deadlines</h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Documents</h2>
            <p className="mt-2 text-muted-foreground">
              Upload and manage your VA benefits documentation here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="claims" className="space-y-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Claims Management</h2>
            <p className="mt-2 text-muted-foreground">
              Track and manage your VA claims process from this section.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 