import { generateMeta } from "@/lib/utils";
import { promises as fs } from "fs";
import path from "path";
import ApiKeysDataTable from "./datatable";
import UpgradePlanCard from "./upgrade-plan-card";
import SuccessfulConversionsCard from "./successful-conversions-card";
import FailedConversionsCard from "./failed-conversions-card";

export async function generateMetadata() {
  return generateMeta({
    title: "Api Keys Management",
    description:
      "Admin panel for managing API keys. Create, organize and control the API keys used across the application.",
    canonical: "/bdoc/api-keys"
  });
}

async function getApiKeys() {
  const data = await fs.readFile(path.join(process.cwd(), "app/bdoc/api-keys/data.json"));
  return JSON.parse(data.toString());
}

export default async function Page() {
  const apiKeys = await getApiKeys();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Api Keys Management</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UpgradePlanCard />
        <SuccessfulConversionsCard />
        <FailedConversionsCard />
      </div>
      <ApiKeysDataTable data={apiKeys} />
    </div>
  );
}
