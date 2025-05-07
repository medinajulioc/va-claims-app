"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function PlannedCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          today={new Date()}
          defaultMonth={new Date()}
          className="flex h-full w-full"
          classNames={{
            months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "h-12",
            row: "w-full mt-2",
            cell: "size-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20"
          }}
        />
      </CardContent>
      <div className="flex flex-col divide-y border-t px-0">
        <div className="w-full">
          <div className="flex items-start p-4">
            <Avatar>
              <AvatarImage src={`${process.env.ASSETS_URL}/avatars/01.png`} />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="ms-4 space-y-1">
              <p className="leading-none font-medium">General Health Check up</p>
              <p className="text-muted-foreground text-sm">Dr. Dianne Philips at 10:00-11:00 AM</p>
            </div>
            <Badge variant="success" className="ms-auto">
              Active
            </Badge>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-start p-4">
            <Avatar>
              <AvatarImage src={`${process.env.ASSETS_URL}/avatars/08.png`} />
              <AvatarFallback>DE</AvatarFallback>
            </Avatar>
            <div className="ms-4 space-y-1">
              <p className="leading-none font-medium">Temporary Headache</p>
              <p className="text-muted-foreground text-sm">Dr. Jenny Smith at 05:00-06:00 PM</p>
            </div>
            <Badge variant="warning" className="ms-auto">
              Pending
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
