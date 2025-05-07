"use client";

import * as React from "react";

import { Area, AreaChart } from "recharts";
import { TrendingDown } from "lucide-react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 274, mobile: 240 }
];

const chartConfig = {
  visitors: {
    label: "Visitors"
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)"
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

export function AverageDailySalesCard() {
  return (
    <Card className="h-full overflow-hidden pb-0">
      <CardHeader>
        <CardDescription>Average Daily Sales</CardDescription>
        <div className="mb-4 text-2xl font-semibold lg:text-3xl">$28,450</div>
        <CardAction>
          <TrendingDown className="size-4 text-red-600" />
        </CardAction>
      </CardHeader>
      <ChartContainer config={chartConfig} className="aspect-auto h-[100px] w-full">
        <AreaChart
          data={chartData}
          margin={{
            top: 5,
            left: 0,
            right: 0
          }}>
          <defs>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Area dataKey="mobile" fill="url(#fillMobile)" stroke="var(--color-mobile)" stackId="a" />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
