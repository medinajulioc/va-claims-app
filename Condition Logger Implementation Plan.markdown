# Condition Logger Feature Implementation Plan

This document provides a comprehensive, step-by-step guide to building the "Condition Logger" feature for a Next.js 15 application using TypeScript, Tailwind CSS v4, Shadcn UI, and Radix UI. The feature enables veterans to log symptoms for VA disability claims, view past logs, and generate professional PDF reports. It includes condition selection, dynamic forms, progress tracking, pre-filled templates, flare-up alerts, a VA claims tracker, voice-to-text logging, multi-condition correlation, offline mode, mood/lifestyle tracking, and enhancements for accessibility, performance, and usability.

The plan is divided into 12 phases, each broken down into small, manageable steps to ensure clarity and ease of implementation. Mock data and sessions are used throughout development mode to simulate functionality.

---

## Phases Overview

1.  **Setup and Basic Structure**

    - Establish the foundation with files, routing, and layout.

2.  **Condition Selection and Dynamic Forms**

    - Build the UI for selecting conditions and logging symptoms.

3.  **Logging Functionality with Mock Data**

    - Implement log saving and retrieval using mock data.

4.  **Progress Tracking**

    - Create a progress card showing logging consistency.

5.  **Pre-Filled Templates and Quick Log Shortcuts**

    - Simplify logging with templates and shortcuts.

6.  **Flare-Up Alerts**

    - Detect and notify users of symptom flare-ups.

7.  **VA Claims Progress Tracker**

    - Track key dates in the claims process.

8.  **Voice-to-Text Logging**

    - Enable symptom logging via speech.

9.  **Multi-Condition Correlation**

    - Analyze relationships between conditions.

10. **Offline Mode**

    - Support logging without internet access.

11. **Mood and Lifestyle Tracking**

    - Add fields for additional health context.

12. **Accessibility, Performance, and Usability Enhancements**

    - Optimize the feature for all users.

---

## Phase 1: Setup and Basic Structure

### Step 1.1: Create Necessary Directories and Files

- **Task**: Set up the project structure.
- **Details**:
  - Create `/components/condition-logger` for feature components.
  - Create `/lib/mockData.ts` for mock data.
  - Create `/app/dashboard/condition-logger/page.tsx` for the main page.

### Step 1.2: Set Up Routing

- **Task**: Make the page accessible in the app.
- **Details**:

  - In `/app/dashboard/layout.tsx`, add a `<Link>` to `/dashboard/condition-logger`.
  - Example:

    ```tsx
    <Link href="/dashboard/condition-logger" className="text-blue-600 hover:underline">
      Condition Logger
    </Link>
    ```

### Step 1.3: Import Required Libraries

- **Task**: Install and import dependencies.
- **Details**:
  - Run `npm install react-to-print @radix-ui/react-tooltip`.
  - Import them in `/app/dashboard/condition-logger/page.tsx` as needed.

### Step 1.4: Create Basic Page Layout

- **Task**: Build the initial UI skeleton.
- **Details**:
  - In `/app/dashboard/condition-logger/page.tsx`, this page and feature will be used inside the established app dashboard.
  - Add a `<h1>` with "Condition Logger" styled with Tailwind CSS (e.g., `text-2xl font-bold`).
  - Include a `<main>` section for future components.

---

## Phase 2: Condition Selection and Dynamic Forms

### Step 2.1: Define Conditions

- **Task**: List conditions with properties.
- **Details**:

  - In `/lib/conditions.ts`, create an array of conditions.
  - Example:

    ```typescript
    export const conditions = [
      {
        name: "Headaches",
        icon: "fa-head-side-cough",
        fields: [
          { name: "date", type: "date", label: "Date", required: true },
          { name: "severity", type: "number", label: "Severity (1-10)", required: true }
        ],
        flareUpThreshold: { severity: 7 }
      }
    ];
    ```

### Step 2.2: Create Condition Cards

- **Task**: Build UI for condition selection.
- **Details**:

  - In `/components/condition-logger/ConditionCard.tsx`, create a card with name and icon.
  - Use Radix UI’s Tooltip for condition descriptions.
  - Example:

    ```tsx
    import {
      TooltipProvider,
      Tooltip,
      TooltipTrigger,
      TooltipContent
    } from "@radix-ui/react-tooltip";

    interface ConditionCardProps {
      condition: { name: string; icon: string };
      onSelect: () => void;
    }

    export const ConditionCard = ({ condition, onSelect }: ConditionCardProps) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={onSelect}
              className="cursor-pointer rounded-lg bg-gray-100 p-4 hover:bg-gray-200">
              <i className={`fas ${condition.icon} mr-2`}></i>
              <span>{condition.name}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Log symptoms for {condition.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    ```

### Step 2.3: Handle Condition Selection

- **Task**: Track the selected condition.
- **Details**:
  - In `/app/dashboard/condition-logger/page.tsx`, add `const [selectedCondition, setSelectedCondition] = useState(null)`.
  - Render `<ConditionCard>` components and update state on click.

### Step 2.4: Implement Dynamic Form

- **Task**: Generate a form for the selected condition.
- **Details**:
  - In `/components/condition-logger/DynamicForm.tsx`, map `selectedCondition.fields` to inputs (e.g., `<Input>` from Shadcn UI).
  - Style with Tailwind CSS and add Radix UI tooltips for field guidance.

---

## Phase 3: Logging Functionality with Mock Data

### Step 3.1: Define Mock Logs

- **Task**: Create sample log data.
- **Details**:

  - In `/lib/mockData.ts`, define mock logs.
  - Example:

    ```typescript
    export const mockLogs = [
      {
        id: "1",
        condition: "Headaches",
        data: { date: "2023-10-01", severity: 7 },
        timestamp: "2023-10-01T10:00:00Z"
      }
    ];
    ```

### Step 3.2: Save Logs

- **Task**: Simulate log storage.
- **Details**:
  - In `/app/dashboard/condition-logger/page.tsx`, use `const [logs, setLogs] = useState(mockLogs)`.
  - On form submit, append new log to `logs` with a unique ID and timestamp.

### Step 3.3: Display Logs

- **Task**: Show logs for the selected condition.
- **Details**:
  - In `/components/condition-logger/LogTable.tsx`, create a table with Shadcn UI’s `<Table>`.
  - Filter `logs` by `selectedCondition.name` and display.

---

## Phase 4: Progress Tracking

### Step 4.1: Calculate Unique Days Logged

- **Task**: Count unique logging days.
- **Details**:

  - In `/app/dashboard/condition-logger/page.tsx`, compute unique days.
  - Example:

    ```typescript
    const uniqueDays = new Set(logs.map((log) => log.timestamp.split("T")[0])).size;
    ```

### Step 4.2: Create Progress Card

- **Task**: Display progress metrics.
- **Details**:

  - In `/components/condition-logger/ProgressCard.tsx`, show total days, per-condition counts, and a `<Progress>` bar (Shadcn UI).
  - Add Radix UI tooltips for each metric (e.g., "Total unique days logged").
  - Example:

    ```tsx
    import { Progress } from "@/components/ui/progress";

    interface ProgressCardProps {
      logs: any[];
    }
    export const ProgressCard = ({ logs }: ProgressCardProps) => {
      const uniqueDays = new Set(logs.map((log) => log.timestamp.split("T")[0])).size;
      return (
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Progress</h2>
          <p>Total Days Logged: {uniqueDays}</p>
          <Progress value={(uniqueDays / 30) * 100} className="mt-2" />
        </div>
      );
    };
    ```

---

## Phase 5: Pre-Filled Templates and Quick Log Shortcuts

### Step 5.1: Define Templates

- **Task**: Create symptom templates.
- **Details**:

  - In `/lib/templates.ts`, define templates.
  - Example:

    ```typescript
    export const templates = {
      Headaches: { severity: 5, date: new Date().toISOString().split("T")[0] }
    };
    ```

### Step 5.2: Implement Template Selection

- **Task**: Pre-fill forms with templates.
- **Details**:
  - In `<DynamicForm>`, add a `<Select>` (Shadcn UI) for template choices.
  - On selection, populate form fields with template data.

### Step 5.3: Add Quick Log Shortcuts

- **Task**: Enable one-click logging.
- **Details**:
  - In `<DynamicForm>`, add `<Button>` elements for common logs (e.g., "Log Mild Headache").
  - On click, save a predefined log to `logs`.

---

## Phase 6: Flare-Up Alerts

### Step 6.1: Define Flare-Up Criteria

- **Task**: Set flare-up thresholds.
- **Details**:
  - In `/lib/conditions.ts`, add `flareUpThreshold` (e.g., `{ severity: 7 }` for Headaches).

### Step 6.2: Implement Alert Logic

- **Task**: Notify users of flare-ups.
- **Details**:
  - In log saving logic, check if `log.data.severity > flareUpThreshold`.
  - If true, show a `<Toast>` (Shadcn UI) with a warning.

---

## Phase 7: VA Claims Progress Tracker

### Step 7.1: Create Tracker Component

- **Task**: Build a claims timeline.
- **Details**:

  - In `/components/condition-logger/ClaimsTracker.tsx`, use a `<ul>` styled with Tailwind CSS.
  - Allow adding dates/notes via a form and store in state.
  - Example:

    ```tsx
    export const ClaimsTracker = () => {
      const [dates, setDates] = useState<string[]>([]);
      return (
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Claims Timeline</h2>
          <input
            type="date"
            onChange={(e) => setDates([...dates, e.target.value])}
            className="rounded border p-2"
          />
          <ul>
            {dates.map((date, i) => (
              <li key={i}>{date}</li>
            ))}
          </ul>
        </div>
      );
    };
    ```

---

## Phase 8: Voice-to-Text Logging

### Step 8.1: Implement Speech Recognition

- **Task**: Add voice input.
- **Details**:
  - In `<DynamicForm>`, use Web Speech API (`SpeechRecognition`).
  - Add a `<Button>` to start recording, parse text, and fill fields.

---

## Phase 9: Multi-Condition Correlation

### Step 9.1: Analyze Log Data

- **Task**: Identify condition patterns.
- **Details**:

  - In `/components/condition-logger/CorrelationView.tsx`, group `logs` by date.
  - Display days with multiple conditions logged.
  - Example:

    ```tsx
    export const CorrelationView = ({ logs }: { logs: any[] }) => {
      const grouped = logs.reduce(
        (acc, log) => {
          const date = log.timestamp.split("T")[0];
          acc[date] = acc[date] ? [...acc[date], log.condition] : [log.condition];
          return acc;
        },
        {} as Record<string, string[]>
      );
      return (
        <div>
          {Object.entries(grouped).map(
            ([date, conditions]) =>
              conditions.length > 1 && (
                <p key={date}>
                  {date}: {conditions.join(", ")}
                </p>
              )
          )}
        </div>
      );
    };
    ```

---

## Phase 10: Offline Mode

### Step 10.1: Implement Local Storage

- **Task**: Save logs offline.
- **Details**:
  - On save, use `localStorage.setItem('logs', JSON.stringify(logs))`.
  - On load, initialize `logs` with `localStorage.getItem('logs')`.

---

## Phase 11: Mood and Lifestyle Tracking

### Step 11.1: Extend Log Fields

- **Task**: Add optional fields.
- **Details**:
  - Update `conditions` fields with `mood` (select) and `sleepHours` (number).
  - Reflect in `<DynamicForm>` and `mockLogs`.

---

## Phase 12: Accessibility, Performance, and Usability Enhancements

### Step 12.1: Add ARIA Attributes

- **Task**: Improve accessibility.
- **Details**:
  - Add `aria-label` to buttons and `aria-describedby` to inputs in all components.

### Step 12.2: Optimize Performance

- **Task**: Handle large log sets.
- **Details**:
  - In `<LogTable>`, use `useMemo` to filter logs and add pagination.

### Step 12.3: Provide User Feedback

- **Task**: Enhance usability.
- **Details**:
  - Show `<Toast>` on log save or errors (e.g., "Log saved successfully").

---

## Main Page Implementation

Below is an example implementation of the main page (`/app/dashboard/condition-logger/page.tsx`), integrating condition selection, dynamic forms, logging, progress tracking, templates, flare-up alerts, voice simulation, and offline mode.

```tsx
import { useState, useEffect } from "react";
import { conditions } from "@/lib/conditions";
import { mockLogs } from "@/lib/mockData";
import { templates } from "@/lib/templates";
import { ConditionCard } from "@/components/condition-logger/ConditionCard";
import { ProgressCard } from "@/components/condition-logger/ProgressCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

export default function ConditionLoggerPage() {
  const [selectedCondition, setSelectedCondition] = useState<(typeof conditions)[0] | null>(null);
  const [logs, setLogs] = useState(mockLogs);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const savedLogs = localStorage.getItem("logs");
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  const handleSaveLog = () => {
    const newLog = {
      id: Date.now().toString(),
      condition: selectedCondition!.name,
      data: formData,
      timestamp: new Date().toISOString()
    };
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem("logs", JSON.stringify(updatedLogs));

    const threshold = selectedCondition!.flareUpThreshold?.severity;
    if (threshold && formData.severity >= threshold) {
      setToast(`Flare-up detected! Severity: ${formData.severity}`);
    } else {
      setToast("Log saved successfully");
    }
  };

  const handleQuickLog = (template: Record<string, any>) => {
    setFormData(template);
    handleSaveLog();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Condition Logger</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          {conditions.map((condition) => (
            <ConditionCard
              key={condition.name}
              condition={condition}
              onSelect={() => setSelectedCondition(condition)}
            />
          ))}
        </div>
        {selectedCondition && (
          <div>
            <h2 className="text-xl font-semibold">{selectedCondition.name}</h2>
            {selectedCondition.fields.map((field) => (
              <div key={field.name} className="mb-2">
                <label className="block">{field.label}</label>
                <Input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  aria-describedby={`${field.name}-desc`}
                />
              </div>
            ))}
            <Button onClick={handleSaveLog} className="mt-2">
              Save Log
            </Button>
            <Button
              onClick={() => handleQuickLog(templates[selectedCondition.name])}
              className="ml-2 mt-2">
              Quick Log
            </Button>
            <Input
              placeholder="Simulate voice input (e.g., 'severity 7')"
              onChange={(e) => {
                if (e.target.value.includes("severity")) {
                  const severity = parseInt(e.target.value.split(" ")[1]);
                  setFormData({ ...formData, severity });
                }
              }}
              className="mt-2"
            />
          </div>
        )}
      </div>
      <ProgressCard logs={logs} />
      {toast && <Toast>{toast}</Toast>}
    </div>
  );
}
```

---

This comprehensive plan ensures that the Condition Logger feature is built methodically, with each phase and step clearly defined. The included code snippets provide practical examples to guide implementation, and the main page implementation demonstrates how multiple features can be integrated cohesively.
