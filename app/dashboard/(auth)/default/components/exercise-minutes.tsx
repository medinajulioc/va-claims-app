"use client";

import { Line, LineChart, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButton } from "@/components/CardActionMenus";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  {
    average: 400,
    today: 240
  },
  {
    average: 300,
    today: 139
  },
  {
    average: 200,
    today: 400
  },
  {
    average: 278,
    today: 390
  },
  {
    average: 189,
    today: 480
  },
  {
    average: 239,
    today: 380
  },
  {
    average: 349,
    today: 400
  }
];

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

export function ExerciseMinutes() {
  return (
    <Card className="h-full">
      <CardHeader className="flex items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle>Exercise Minutes</CardTitle>
          <CardDescription>
            Your exercise minutes are ahead of where you normally are.
          </CardDescription>
        </div>
        <ExportButton />
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-32 w-full lg:h-[250px]" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10
            }}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background rounded-lg border p-2 shadow-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[0.70rem] uppercase">
                            Average
                          </span>
                          <span className="text-muted-foreground font-bold">
                            {payload[0].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[0.70rem] uppercase">
                            Today
                          </span>
                          <span className="font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="average"
              activeDot={{
                r: 6,
                style: { fill: "var(--theme-primary)", opacity: 0.25 }
              }}
              style={
                {
                  stroke: "var(--theme-primary)",
                  opacity: 0.35,
                  "--theme-primary": `var(--primary)`
                } as React.CSSProperties
              }
            />
            <Line
              type="monotone"
              dataKey="today"
              strokeWidth={2}
              activeDot={{
                r: 8,
                style: { fill: "var(--theme-primary)" }
              }}
              style={
                {
                  stroke: "var(--theme-primary)",
                  "--theme-primary": `var(--primary)`
                } as React.CSSProperties
              }
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
