export const dummyMessages = [
  {
    id: "1",
    role: "user",
    content: "Generate a UI component for a dashboard.",
    createdAt: new Date("2025-05-01T10:00:00Z"),
  },
  {
    id: "2",
    role: "assistant",
    content: "Here's a sample dashboard component:\n\n```tsx\n'use client';\nimport { Card } from '@/components/ui/card';\n\nexport default function Dashboard() {\n  return (\n    <Card className=\"p-4\">\n      <h2>Dashboard</h2>\n      <p>Welcome to your dashboard!</p>\n    </Card>\n  );\n}\n```",
    createdAt: new Date("2025-05-01T10:01:00Z"),
  },
];

export const projectsList = [
  { id: 1, name: "PTSD Disability Claim", status: "In Progress" },
  { id: 2, name: "Hearing Loss - Service Connected", status: "Submitted" },
  { id: 3, name: "Back Injury Appeal", status: "Draft" },
  { id: 4, name: "Gulf War Syndrome", status: "In Progress" },
  { id: 5, name: "Knee Replacement - Secondary Claim", status: "Submitted" },
]; 