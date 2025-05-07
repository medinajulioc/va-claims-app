import { Award, Briefcase, DollarSign, FileClock } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-orange-600/20 bg-orange-50 dark:bg-orange-950/50">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>
            <span className="text-green-600">+20.1% </span>from last month
          </CardDescription>
          <CardAction>
            <DollarSign className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold lg:text-3xl">$45,231.89</div>
        </CardContent>
      </Card>
      <Card className="border-green-600/20 bg-green-50 dark:bg-green-950/50">
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>
            <span className="text-green-600">+5.02%</span> from last month
          </CardDescription>
          <CardAction>
            <Briefcase className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold lg:text-3xl">1.423</div>
        </CardContent>
      </Card>
      <Card className="border-blue-600/20 bg-blue-50 dark:bg-blue-950/50">
        <CardHeader>
          <CardTitle>New Leads</CardTitle>
          <CardDescription>
            <span className="text-red-600">-3.58%</span> from last month
          </CardDescription>
          <CardAction>
            <Award className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold lg:text-3xl">3.500</div>
        </CardContent>
      </Card>
      <Card className="border-purple-600/20 bg-purple-50 dark:bg-purple-950/50">
        <CardHeader>
          <CardTitle>Time Spent</CardTitle>
          <CardDescription>
            <span className="text-red-600">-3.58%</span> from last month
          </CardDescription>
          <CardAction>
            <FileClock className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold lg:text-3xl">168h 40m</div>
        </CardContent>
      </Card>
    </div>
  );
}
