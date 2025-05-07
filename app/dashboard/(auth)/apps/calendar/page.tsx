import { generateMeta } from "@/lib/utils";
import CalendarApp from "@/app/dashboard/(auth)/apps/calendar/calendar-app";
import CalendarSidebar from "@/app/dashboard/(auth)/apps/calendar/calendar-sidebar";
import EventSheet from "@/app/dashboard/(auth)/apps/calendar/event-sheet";
import React from "react";

export async function generateMetadata() {
  return generateMeta({
    title: "Calendar",
    description:
      "Plan your events or tasks in an organized way with the Calendar app template. Built with shadcn/ui, Next.js and Tailwind CSS.",
    canonical: "/apps/calendar"
  });
}

export default function Page() {
  return (
    <div className="flex lg:space-x-5">
      <CalendarSidebar />
      <div className="grow">
        <CalendarApp />
      </div>
      <EventSheet />
    </div>
  );
}
