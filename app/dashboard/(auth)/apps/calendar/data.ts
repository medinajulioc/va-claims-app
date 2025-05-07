import { EventInput } from "@fullcalendar/core";

export const eventColors: Record<string, string> = {
  blue: "text-xs bg-linear-to-r from-blue-500 to-purple-500 text-white dark:bg-blue-950 hover:bg-linear-to-r hover:opacity-80",
  red: "text-xs bg-linear-to-r from-red-500 to-yellow-500 text-white dark:bg-blue-950 hover:bg-linear-to-r hover:opacity-80",
  green:
    "text-xs bg-linear-to-r from-green-500 to-yellow-500 text-white dark:bg-blue-950 hover:bg-linear-to-r hover:opacity-80",
  purple:
    "text-xs bg-linear-to-r from-purple-500 to-pink-500 text-white dark:bg-blue-950 hover:bg-linear-to-r hover:opacity-80",
  orange:
    "text-xs bg-linear-to-r from-orange-500 to-red-500 text-white dark:bg-blue-950 hover:bg-linear-to-r hover:opacity-80",
  teal: "text-xs bg-linear-to-r from-teal-500 to-green-500 text-white dark:bg-blue-950 hover:bg-linear-to-r hover:opacity-80"
};

export const calendarEvents: EventInput[] = [
  {
    id: "1",
    title: "Marketing Strategy Meeting",
    start: new Date(2025, 2, 3, 9, 0).toISOString(),
    end: new Date(2025, 2, 4, 10, 30).toISOString(),
    description: "Discuss marketing plans for Q2",
    color: "blue"
  },
  {
    id: "2",
    title: "Team Meeting",
    start: new Date(2025, 2, 4, 10, 0).toISOString(),
    end: new Date(2025, 2, 4, 11, 0).toISOString(),
    description: "Weekly team sync",
    color: "red"
  },
  {
    id: "3",
    title: "Product Brainstorming",
    start: new Date(2025, 2, 5, 11, 0).toISOString(),
    end: new Date(2025, 2, 5, 12, 30).toISOString(),
    description: "Idea session for new features",
    color: "green"
  },
  {
    id: "4",
    title: "Lunch with Investor",
    start: new Date(2025, 2, 6, 12, 30).toISOString(),
    end: new Date(2025, 2, 6, 13, 30).toISOString(),
    color: "orange"
  },
  {
    id: "5",
    title: "Client Presentation",
    start: new Date(2025, 2, 7, 14, 0).toISOString(),
    end: new Date(2025, 2, 7, 15, 30).toISOString(),
    description: "Present the new project proposal",
    color: "purple"
  },
  {
    id: "6",
    title: "Project Deadline",
    start: new Date(2025, 2, 8, 16, 0).toISOString(),
    end: new Date(2025, 2, 8, 17, 0).toISOString(),
    description: "Final deliverables submission",
    color: "blue"
  },
  {
    id: "7",
    title: "Tech Conference",
    start: new Date(2025, 2, 9, 9, 0).toISOString(),
    end: new Date(2025, 2, 9, 17, 0).toISOString(),
    description: "Attend industry-leading tech talks",
    color: "teal"
  },
  {
    id: "8",
    title: "Quarterly Sales Review",
    start: new Date(2025, 2, 10, 10, 30).toISOString(),
    end: new Date(2025, 2, 10, 12, 0).toISOString(),
    description: "Analyze Q1 sales performance",
    color: "red"
  },
  {
    id: "9",
    title: "Team Building Activity",
    start: new Date(2025, 2, 11, 14, 0).toISOString(),
    end: new Date(2025, 2, 11, 16, 0).toISOString(),
    description: "Outdoor sports and games",
    color: "green"
  },
  {
    id: "10",
    title: "Networking Event",
    start: new Date(2025, 2, 12, 18, 0).toISOString(),
    end: new Date(2025, 2, 12, 20, 0).toISOString(),
    description: "Meet industry professionals",
    color: "orange"
  },
  {
    id: "11",
    title: "Product Launch Event",
    start: new Date(2025, 2, 13, 9, 0).toISOString(),
    end: new Date(2025, 2, 13, 11, 0).toISOString(),
    description: "Launch of the new software update",
    color: "purple"
  },
  {
    id: "12",
    title: "HR Policy Discussion",
    start: new Date(2025, 2, 14, 10, 0).toISOString(),
    end: new Date(2025, 2, 14, 11, 30).toISOString(),
    description: "Revise company HR policies",
    color: "teal"
  },
  {
    id: "13",
    title: "Investor Pitch",
    start: new Date(2025, 2, 15, 15, 0).toISOString(),
    end: new Date(2025, 2, 15, 16, 30).toISOString(),
    description: "Pitch for Series A funding",
    color: "blue"
  },
  {
    id: "14",
    title: "UX/UI Workshop",
    start: new Date(2025, 2, 16, 13, 0).toISOString(),
    end: new Date(2025, 2, 16, 15, 0).toISOString(),
    description: "Improve product design",
    color: "red"
  },
  {
    id: "15",
    title: "Customer Feedback Session",
    start: new Date(2025, 2, 17, 12, 0).toISOString(),
    end: new Date(2025, 2, 17, 13, 30).toISOString(),
    description: "Gather insights from users",
    color: "green"
  }
];
