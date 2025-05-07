import * as React from "react";

import { ArrowDownIcon } from "lucide-react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";

export function ExpenseCard() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>Total Expense</CardDescription>
        <div className="text-2xl font-semibold lg:text-3xl">$15,010</div>
        <div className="flex items-center text-xs">
          <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
          <span className="font-medium text-red-500">6.0%</span>
          <span className="text-muted-foreground ml-1">Compare from last month</span>
        </div>
      </CardHeader>
    </Card>
  );
}
