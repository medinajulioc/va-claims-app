"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { ClockIcon, MessageCircleReplyIcon, TicketIcon } from "lucide-react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

const chartData = [
  { browser: "new", tickets: 40, fill: "var(--color-new)" },
  { browser: "open", tickets: 25, fill: "var(--color-open)" }
];

const chartConfig = {
  new: {
    label: "New Tickets",
    color: "var(--chart-1)"
  },
  open: {
    label: "Open Tickets",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

export function TicketsCard() {
  return (
    <Card className="h-full">
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[270px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="tickets"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold">
                          88%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground">
                          Completed
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start justify-start gap-4 border-t md:flex-row md:justify-between lg:items-center lg:gap-0">
        <div className="flex w-full items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-green-400 bg-green-200 dark:bg-green-900">
            <TicketIcon className="size-4" />
          </div>
          <div className="flex flex-1 flex-row justify-between md:flex-col md:justify-normal">
            <div className="text-sm">New Tickets</div>
            <div className="text-muted-foreground ms-auto text-sm md:ms-0">40</div>
          </div>
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-orange-400 bg-orange-200 dark:bg-orange-900">
            <ClockIcon className="size-4" />
          </div>
          <div className="flex flex-1 flex-row justify-between md:flex-col md:justify-normal">
            <div className="text-sm">Open Tickets</div>
            <div className="text-muted-foreground ms-auto text-sm md:ms-0">25</div>
          </div>
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-teal-400 bg-teal-200 dark:bg-teal-900">
            <MessageCircleReplyIcon className="size-4" />
          </div>
          <div className="flex flex-1 flex-row justify-between md:flex-col md:justify-normal">
            <div className="text-sm">Response Time</div>
            <div className="text-muted-foreground ms-auto text-sm md:ms-0">1 Day</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
