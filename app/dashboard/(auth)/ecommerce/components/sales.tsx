"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

export function EcommerceSalesCard() {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-3)"
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-4)"
    }
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 100, mobile: 80 },
    { month: "February", desktop: 150, mobile: 200 },
    { month: "March", desktop: 300, mobile: 120 },
    { month: "April", desktop: 120, mobile: 190 },
    { month: "May", desktop: 80, mobile: 130 },
    { month: "June", desktop: 150, mobile: 140 }
  ];

  return (
    <Card className="md:col-span-6 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales</CardTitle>
        <CardDescription className="text-xs">
          <span className="text-red-500">-1.7%</span> from last month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">20K</div>
        <div className="pt-4">
          <ChartContainer className="h-[60px] w-full" config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 6
              }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-desktop)"
                }}
                activeDot={{
                  r: 6
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
