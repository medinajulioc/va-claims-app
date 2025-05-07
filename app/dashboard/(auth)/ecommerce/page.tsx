import { generateMeta } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  EcommerceBestSellingProductsCard,
  EcommerceCustomerReviewsCard,
  EcommerceNewCustomersCard,
  EcommerceRecentOrdersCard,
  EcommerceReturnRateCard,
  EcommerceRevenueCard,
  EcommerceSalesByLocationCard,
  EcommerceSalesCard,
  EcommerceTotalRevenueCard,
  EcommerceVisitBySourceCard,
  EcommerceWelcomeCard
} from "@/app/dashboard/(auth)/ecommerce/components";
import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { Download } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "Ecommerce Admin Dashboard",
    description:
      "The e-commerce admin dashboard template is an admin template that you can use for your e-commerce website projects. Built with shadcn/ui, Tailwind CSS, Next.js.",
    canonical: "/ecommerce"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">E-Commerce Dashboard</h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-12">
          <EcommerceWelcomeCard />
          <EcommerceRevenueCard />
          <EcommerceSalesCard />
          <EcommerceNewCustomersCard />
        </div>
        <div className="space-y-4 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">
          <EcommerceTotalRevenueCard />
          <EcommerceReturnRateCard />
        </div>
        <div className="grid gap-4 lg:grid-cols-12">
          <EcommerceSalesByLocationCard />
          <EcommerceVisitBySourceCard />
          <EcommerceCustomerReviewsCard />
        </div>
        <div className="space-y-4 xl:grid xl:grid-cols-12 xl:gap-4 xl:space-y-0">
          <EcommerceRecentOrdersCard />
          <EcommerceBestSellingProductsCard />
        </div>
      </div>
    </div>
  );
}
