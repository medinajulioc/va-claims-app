import { ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import * as React from "react";

export function BalanceCard() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>Total Balance</CardDescription>
        <div className="text-2xl font-semibold lg:text-3xl">$103,045</div>
        <div className="flex items-center text-xs">
          <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
          <span className="font-medium text-green-500">3.6%</span>
          <span className="text-muted-foreground ml-1">Compare from last month</span>
        </div>
      </CardHeader>
    </Card>
  );
}
