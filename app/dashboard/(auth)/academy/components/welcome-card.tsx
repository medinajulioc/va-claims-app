import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WelcomeCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative">
        <div className="grid items-center pt-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="text-3xl font-semibold">
              Hi, Andrew <span className="text-4xl">👋</span>
            </div>
            <div className="text-2xl">What do you want to learn today with your partner?</div>
            <div className="text-muted-foreground">
              Discover courses, track progress, and achieve your learning goods seamlessly.
            </div>
            <div className="pt-2">
              <Button>Explorer Course</Button>
            </div>
          </div>
          <figure className="hidden lg:col-span-1 lg:block">
            <Image
              width={100}
              height={50}
              src={`${process.env.DASHBOARD_BASE_URL}/academy-dashboard-light.svg`}
              className="block w-full dark:hidden"
              unoptimized
              alt="shadcn/ui"
            />
            <Image
              width={100}
              height={50}
              src={`${process.env.DASHBOARD_BASE_URL}/academy-dashboard-dark.svg`}
              className="hidden w-full dark:block"
              unoptimized
              alt="shadcn/ui"
            />
          </figure>
          <Image
            width={800}
            height={300}
            src={`${process.env.DASHBOARD_BASE_URL}/star-shape.png`}
            className="pointer-events-none absolute inset-0 aspect-auto"
            unoptimized
            alt="shadcn/ui"
          />
        </div>
      </CardContent>
    </Card>
  );
}
