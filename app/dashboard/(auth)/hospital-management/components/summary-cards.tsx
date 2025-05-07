import { CalendarIcon, CreditCardIcon, DollarSignIcon, UsersIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountAnimation from "@/components/ui/custom/count-animation";

export function SummaryCards() {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-muted rounded-none border-y-transparent border-s-transparent transition-colors">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
            <CardTitle>Total Appointments</CardTitle>
            <div className="absolute end-4 top-0 flex size-12 items-center justify-center rounded-full bg-indigo-200 p-4 dark:bg-indigo-950">
              <CalendarIcon className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-semibold">
              <CountAnimation number={2350} />
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted rounded-none border-y-transparent border-s-transparent transition-colors">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
            <CardTitle>New Patients</CardTitle>
            <div className="absolute end-4 top-0 flex size-12 items-end justify-start rounded-full bg-green-200 p-4 dark:bg-green-950">
              <UsersIcon className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-semibold">
              <CountAnimation number={145} />
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+180.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted rounded-none border-y-transparent border-s-transparent transition-colors">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
            <CardTitle>Operations</CardTitle>
            <div className="absolute end-4 top-0 flex size-12 items-end justify-start rounded-full bg-purple-200 p-4 dark:bg-purple-950">
              <CreditCardIcon className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-semibold">
              <CountAnimation number={89} />
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-red-600">-19%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted rounded-none border-transparent transition-colors">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
            <CardTitle>Total Revenue</CardTitle>
            <div className="absolute end-4 top-0 flex size-12 items-end justify-start rounded-full bg-orange-200 p-4 dark:bg-orange-950">
              <DollarSignIcon className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-semibold">
              $<CountAnimation number={9583} />
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
