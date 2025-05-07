"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { ExportButton } from "@/components/CardActionMenus";
import { Bar, BarChart, XAxis } from "recharts";

export function EcommerceTotalRevenueCard() {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)"
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)"
    }
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 190, mobile: 180 },
    { month: "February", desktop: 250, mobile: 200 },
    { month: "March", desktop: 240, mobile: 120 },
    { month: "April", desktop: 120, mobile: 190 },
    { month: "May", desktop: 110, mobile: 130 },
    { month: "June", desktop: 250, mobile: 140 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>Income in the last 28 days</CardDescription>
        <CardAction className="relative col-start-auto row-start-auto justify-self-start lg:col-start-2 lg:row-start-1 lg:justify-self-end">
          <div className="end-0 top-0 mt-2 flex flex-col items-stretch space-y-0 p-0 sm:flex-row lg:absolute lg:mt-0">
            <div className="flex gap-8 rounded-lg border p-4">
              <button className="flex flex-1 flex-col justify-center gap-2 text-left">
                <span className="text-muted-foreground text-xs">Desktop</span>
                <span className="text-lg leading-none font-bold sm:text-2xl">24,828</span>
              </button>
              <button className="flex flex-1 flex-col justify-center gap-2 text-left">
                <span className="text-muted-foreground text-xs">Mobile</span>
                <span className="text-lg leading-none font-bold sm:text-2xl">25,010</span>
              </button>
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="lg:mt-10">
          <ChartContainer className="!aspect-21/9 w-full" config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: -6,
                right: -6
              }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
