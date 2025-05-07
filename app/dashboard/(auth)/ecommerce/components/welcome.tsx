import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EcommerceWelcomeCard() {
  return (
    <Card className="bg-muted relative overflow-hidden md:col-span-6 xl:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl">Congratulations Toby! 🎉</CardTitle>
        <CardDescription>Best seller of the month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-semibold">$15,231.89</div>
            <div className="text-muted-foreground text-xs">
              <span className="text-green-500">+65%</span> from last month
            </div>
          </div>
          <Button variant="outline">View Sales</Button>
        </div>
      </CardContent>
      <Image
        width={800}
        height={300}
        src={`${process.env.DASHBOARD_BASE_URL}/star-shape.png`}
        className="pointer-events-none absolute inset-0 aspect-auto"
        unoptimized
        alt="..."
      />
    </Card>
  );
}
