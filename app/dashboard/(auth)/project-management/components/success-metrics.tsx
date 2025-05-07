import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getInitials } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const users = [
  { name: "Emma Smith", avatar: `${process.env.ASSETS_URL}/avatars/08.png` },
  { name: "Olivia Johnson", avatar: `${process.env.ASSETS_URL}/avatars/09.png` },
  { name: "Ava Brown", avatar: `${process.env.ASSETS_URL}/avatars/03.png` },
  { name: "Sophia Taylor", avatar: `${process.env.ASSETS_URL}/avatars/04.png` },
  { name: "Isabella Anderson", avatar: `${process.env.ASSETS_URL}/avatars/05.png` },
  { name: "Mia Thomas", avatar: `${process.env.ASSETS_URL}/avatars/06.png` }
];

export function SuccessMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Professionals</CardDescription>
        <CardTitle className="text-2xl font-semibold lg:text-3xl">357</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm font-bold">Today’s Heroes</p>
        <div className="flex -space-x-4">
          <TooltipProvider>
            {users.map((user, key) => (
              <Tooltip key={key}>
                <TooltipTrigger>
                  <Avatar className="border-background size-12 border-4 hover:z-10">
                    <AvatarImage src={user.avatar} alt="shadcn ui kit" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{user.name}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <p className="mt-8 mb-2 text-sm font-bold">Highlights</p>
        <div className="divide-y *:py-3">
          <div className="flex justify-between text-sm">
            <span>Avg. Client Rating</span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="size-4 text-green-600" />
              7.8 / 10
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Avg. Quotes</span>
            <span className="flex items-center gap-1">
              <ArrowDownLeft className="size-4 text-red-600" />
              730
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Avg. Agent Earnings</span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="size-4 text-green-600" /> $2,309
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
