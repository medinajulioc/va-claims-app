import { promises as fs } from "fs";
import path from "path";
import { generateMeta } from "@/lib/utils";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import OrdersDataTable from "./data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function generateMetadata() {
  return generateMeta({
    title: "Orders Page",
    description:
      "A list of orders generated using the Tanstack Table. Built with Tailwind CSS, shadcn/ui and Next.js.",
    canonical: "/pages/orders"
  });
}

async function getOrders() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/dashboard/(auth)/pages/orders/data.json")
  );

  return JSON.parse(data.toString());
}

export default async function Page() {
  const orders = await getOrders();

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Orders</h1>
        <Button asChild>
          <Link href="#">
            <PlusCircledIcon /> Create Order
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        <OrdersDataTable data={orders} />
      </Tabs>
    </div>
  );
}
