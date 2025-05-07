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
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";

export function EcommerceReturnRateCard() {
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
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 473, mobile: 190 },
    { month: "May", desktop: 409, mobile: 130 },
    { month: "June", desktop: 514, mobile: 140 },
    { month: "July", desktop: 237, mobile: 120 },
    { month: "August", desktop: 473, mobile: 190 },
    { month: "September", desktop: 409, mobile: 130 },
    { month: "October", desktop: 514, mobile: 300 },
    { month: "November", desktop: 390, mobile: 240 },
    { month: "December", desktop: 700, mobile: 460 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardDescription className="relative">Returning Rate</CardDescription>
        <CardAction className="relative">
          <ExportButton className="absolute end-0 top-0" />
        </CardAction>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">$42,379</div>
          <Badge className="text-green-600" variant="outline">
            +2.5%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="mt-0 !aspect-21/9 w-full md:mt-6" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
            <Line
              dataKey="mobile"
              stroke="var(--color-mobile)"
              style={
                {
                  opacity: 0.35
                } as React.CSSProperties
              }
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
