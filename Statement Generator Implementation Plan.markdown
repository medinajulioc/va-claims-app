# Statement Generator Implementation Plan for NextJS 15 Dashboard

This document provides a comprehensive, step-by-step phased plan to implement the **Statement Generator** feature within your existing NextJS 15 application, using TypeScript, Tailwind CSS v4, and the app router. The tool enables veterans to generate statements for VA Form 21-0781 (Statement in Support of Claimed Mental Health Disorder(s) Due to an In-Service Traumatic Event(s)), VA Form 21-10210 (Lay/Witness Statement), and VA Form 21-4138 (Statement in Support of Claim). It will be integrated into your dashboard at the `/dashboard/statement-generator` route, ensuring a seamless user experience.

## Overview

The Statement Generator features:

- A dropdown to select a VA form (21-0781, 21-10210, or 21-4138).
- A multi-step form with guided inputs tailored to the selected form.
- A review step displaying an AI-generated statement.
- Export to official VA PDF forms using `pdf-lib`.

The design prioritizes simplicity, empathy, and accessibility, using Tailwind CSS v4 for styling, Shadcn UI and Radix UI for components, and mock data/sessions for safe testing. A disclaimer ensures users review outputs with VA-accredited professionals due to the legal significance of VA forms. Use our UI color theme and colors. And place it as a feature inside our dashboard, like any other feature. 

## Prerequisites

- **Existing Setup**: Your NextJS 15 app with TypeScript, Tailwind CSS v4, and app router, including a dashboard route (`/dashboard`).
- **VA PDFs**: Fillable PDFs for VA Form 21-0781, VA Form 21-10210, and VA Form 21-4138, placed in `public/` as:
  - `public/VBA-21-0781-ARE.pdf`
  - `public/VBA-21-10210-ARE.pdf`
  - `public/VBA-21-4138-ARE.pdf`
- **Tailwind CSS v4**: Configured in `tailwind.config.ts` to scan `app/` and `components/` directories, with `app/globals.css` including Tailwind directives and imported in `app/layout.tsx`.

## Phases

1. **Project Setup**
2. **Route and UI Design**
3. **Form Logic**
4. **API Integration**
5. **PDF Export**
6. **Mock Data and Testing**
7. **Accessibility and Responsiveness**
8. **Deployment**

## Phase 1: Project Setup

Set up dependencies and organize resources within your NextJS 15 app.

### Step 1.1: Install Dependencies

Add packages for form management, PDF handling, UI components, and API mocking:

```bash
npm install react-hook-form @hookform/resolvers zod pdf-lib msw
npm install @radix-ui/react-tooltip @radix-ui/react-select
```

Install Shadcn UI components for consistent styling (if not already installed):

```bash
npx shadcn@latest add button input textarea select card
```

### Step 1.2: Verify Tailwind CSS v4 Configuration

Ensure `tailwind.config.ts` includes your project’s directories:

```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Confirm `app/globals.css` includes Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 1.3: Organize Fillable PDFs

Place the VA PDFs in `public/` as specified in the prerequisites.

### Step 1.4: Create Directory Structure

Set up directories for components, utilities, and API routes:

```bash
mkdir -p app/components app/lib app/api/fill-va-form-21-0781 app/api/fill-va-form-21-10210 app/api/fill-va-form-21-4138 app/api/generate-documents app/dashboard/statement-generator
```

## Phase 2: Route and UI Design

Integrate the Statement Generator into the `/dashboard/statement-generator` route and design the UI.

### Step 2.1: Create Dashboard Route

Ensure your dashboard exists at `app/dashboard/layout.tsx`. If not, create it:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-4">
      {/* Add dashboard navigation or sidebar if needed */}
      {children}
    </div>
  );
}
```

Create the Statement Generator page at `app/dashboard/statement-generator/page.tsx`:

```tsx
// app/dashboard/statement-generator/page.tsx
import { MultiStepForm } from "@/components/MultiStepForm";

export default function StatementGenerator() {
  return (
    <div className="py-6">
      <MultiStepForm />
    </div>
  );
}
```

This sets up the `/dashboard/statement-generator` route, rendering the `MultiStepForm` component.

### Step 2.2: Create Multi-Step Form Component

Create `app/components/MultiStepForm.tsx` with a centered layout (max-width 672px), form type dropdown, and responsive stepper:

```tsx
// app/components/MultiStepForm.tsx
"use client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { schemas, stepFields } from "@/lib/schemas";
import { VeteranInfoForm } from "./VeteranInfoForm";
import { ServiceHistoryForm } from "./ServiceHistoryForm";
import { TraumaticEventsForm } from "./TraumaticEventsForm";
import { ClaimantInfoForm } from "./ClaimantInfoForm";
import { ConditionDetailsForm } from "./ConditionDetailsForm";
import { StatementForm } from "./StatementForm";
import { ReviewForm } from "./ReviewForm";
import { MockDataLoader } from "./MockDataLoader";

const stepsConfig = {
  "21-0781": ["Veteran Information", "Service History", "Traumatic Events", "Review"],
  "21-10210": ["Veteran Information", "Claimant Information", "Service History", "Condition Details", "Review"],
  "21-4138": ["Veteran Information", "Statement", "Review"],
};

export function MultiStepForm() {
  const [formType, setFormType] = useState<"21-0781" | "21-10210" | "21-4138">("21-10210");
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(schemas[formType]),
    defaultValues: Object.keys(schemas[formType].shape).reduce((acc, key) => ({
      ...acc,
      [key]: "",
    }), {}),
  });

  const steps = stepsConfig[formType];

  const nextStep = async () => {
    const fields = stepFields[formType][currentStep];
    const isValid = await methods.trigger(fields);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, formType }),
      });
      const result = await response.json();
      setGeneratedText(result.text);
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error("Error generating documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      const formData = methods.getValues();
      const response = await fetch(`/api/fill-va-form-${formType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, statement: generatedText }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `va-form-${formType}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Statement Generator</h1>
        <p className="text-sm text-gray-600 mb-4">
          Generate draft VA statements. Review with a VA-accredited professional before submission.
        </p>
        <Select onValueChange={setFormType} defaultValue={formType}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select VA Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="21-0781">VA Form 21-0781 (PTSD Statement)</SelectItem>
            <SelectItem value="21-10210">VA Form 21-10210 (Lay/Witness Statement)</SelectItem>
            <SelectItem value="21-4138">VA Form 21-4138 (General Statement)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-2 ${index === currentStep ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"} sm:rounded-md m-1 text-sm sm:text-base`}
            >
              {step}
            </div>
          ))}
        </div>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {formType === "21-0781" && (
            <>
              {currentStep === 0 && <VeteranInfoForm />}
              {currentStep === 1 && <ServiceHistoryForm />}
              {currentStep === 2 && <TraumaticEventsForm />}
              {currentStep === 3 && <ReviewForm generatedText={generatedText} handleExportPDF={handleExportPDF} isLoading={isLoading} />}
            </>
          )}
          {formType === "21-10210" && (
            <>
              {currentStep === 0 && <VeteranInfoForm />}
              {currentStep === 1 && <ClaimantInfoForm />}
              {currentStep === 2 && <ServiceHistoryForm />}
              {currentStep === 3 && <ConditionDetailsForm />}
              {currentStep === 4 && <ReviewForm generatedText={generatedText} handleExportPDF={handleExportPDF} isLoading={isLoading} />}
            </>
          )}
          {formType === "21-4138" && (
            <>
              {currentStep === 0 && <VeteranInfoForm />}
              {currentStep === 1 && <StatementForm />}
              {currentStep === 2 && <ReviewForm generatedText={generatedText} handleExportPDF={handleExportPDF} isLoading={isLoading} />}
            </>
          )}
          <MockDataLoader formType={formType} />
          <div className="flex justify-between mt-6">
            <Button type="button" onClick={prevStep} disabled={currentStep === 0 || isLoading} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} disabled={isLoading} className="bg-blue-500 text-white hover:bg-blue-600">
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="bg-blue-500 text-white hover:bg-blue-600">
                {isLoading ? "Generating..." : "Generate Statement"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
```

### Step 2.3: Create Form Components

Implement form components with Tailwind CSS v4 and Shadcn UI. Example for `VeteranInfoForm`:

```tsx
// app/components/VeteranInfoForm.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useFormContext } from "react-hook-form";

export function VeteranInfoForm() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Veteran Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <label className="block text-sm font-medium text-gray-700">Veteran's Full Name</label>
                <Input {...register("veteranName")} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                {errors.veteranName && <p className="text-red-500 text-sm mt-1">{errors.veteranName.message}</p>}
              </div>
            </TooltipTrigger>
            <TooltipContent>Enter the veteran's full legal name.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <label className="block text-sm font-medium text-gray-700">Social Security Number</label>
                <Input {...register("veteranSSN")} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                {errors.veteranSSN && <p className="text-red-500 text-sm mt-1">{errors.veteranSSN.message}</p>}
              </div>
            </TooltipTrigger>
            <TooltipContent>Enter the veteran's SSN for identification.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <Input type="date" {...register("veteranDateOfBirth")} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                {errors.veteranDateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.veteranDateOfBirth.message}</p>}
              </div>
            </TooltipTrigger>
            <TooltipContent>Provide the veteran's date of birth in MM/DD/YYYY format.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <Input {...register("veteranAddress")} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                {errors.veteranAddress && <p className="text-red-500 text-sm mt-1">{errors.veteranAddress.message}</p>}
              </div>
            </TooltipTrigger>
            <TooltipContent>Enter the veteran's current mailing address.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input {...register("veteranPhone")} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                {errors.veteranPhone && <p className="text-red-500 text-sm mt-1">{errors.veteranPhone.message}</p>}
              </div>
            </TooltipTrigger>
            <TooltipContent>Provide a contact phone number.</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                <Input {...register("veteranEmail")} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                {errors.veteranEmail && <p className="text-red-500 text-sm mt-1">{errors.veteranEmail.message}</p>}
              </div>
            </TooltipTrigger>
            <TooltipContent>Enter an email address if available.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
```

Create similar components for:

- `ServiceHistoryForm`: Branch, service dates, deployments (Select and Input).
- `TraumaticEventsForm`: Textarea for traumatic events (21-0781).
- `ClaimantInfoForm`: Claimant details (21-10210).
- `ConditionDetailsForm`: Disability, service connection, witness info (21-10210).
- `StatementForm`: Textarea for general statement (21-4138).
- `ReviewForm`: Textarea for generated text and export button.

Example for `ReviewForm`:

```tsx
// app/components/ReviewForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReviewForm({ generatedText, handleExportPDF, isLoading }: { generatedText: string; handleExportPDF: () => void; isLoading: boolean }) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Review Generated Statement</CardTitle>
      </CardHeader>
      <CardContent>
        {generatedText ? (
          <div>
            <p className="mb-4 text-gray-600">Please review the generated statement below. You can export it as a filled-out VA form.</p>
            <Textarea value={generatedText} readOnly className="min-h-[200px] border-gray-300" />
            <Button onClick={handleExportPDF} disabled={isLoading} className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
              {isLoading ? "Generating PDF..." : "Export to VA Form"}
            </Button>
          </div>
        ) : (
          <p className="text-gray-600">Click "Generate Statement" to create your draft.</p>
        )}
      </CardContent>
    </Card>
  );
}
```

### Step 2.4: Style with Tailwind CSS v4

Use Tailwind’s utility classes for a neutral, professional design:

- Colors: `gray-700` for text, `blue-500` for primary buttons, `red-500` for errors.
- Responsive stepper: `flex-col sm:flex-row`.
- Cards: `border-gray-200 shadow-sm` for subtle depth.
- Inputs: `border-gray-300 focus:border-blue-500 focus:ring-blue-500` for focus states.

### Step 2.5: Add Tooltips

Use Radix UI’s Tooltip for accessible guidance, ensuring keyboard and screen reader support.

## Phase 3: Form Logic

Implement form state management, validation, and navigation.

### Step 3.1: Define Validation Schemas

Create `app/lib/schemas.ts` with Zod schemas and step fields:

```tsx
// app/lib/schemas.ts
import { z } from "zod";

export const schemas = {
  "21-0781": z.object({
    veteranName: z.string().min(1, "Veteran's name is required"),
    veteranSSN: z.string().min(1, "Veteran's SSN is required"),
    veteranDateOfBirth: z.string().min(1, "Date of birth is required"),
    veteranAddress: z.string().min(1, "Address is required"),
    veteranPhone: z.string().min(1, "Phone number is required"),
    veteranEmail: z.string().email().optional(),
    branch: z.string().min(1, "Branch of service is required"),
    serviceDates: z.string().min(1, "Service dates are required"),
    traumaticEvents: z.string().min(1, "Traumatic events description is required"),
  }),
  "21-10210": z.object({
    veteranName: z.string().min(1, "Veteran's name is required"),
    veteranSSN: z.string().min(1, "Veteran's SSN is required"),
    veteranDateOfBirth: z.string().min(1, "Date of birth is required"),
    veteranAddress: z.string().min(1, "Address is required"),
    veteranPhone: z.string().min(1, "Phone number is required"),
    veteranEmail: z.string().email().optional(),
    claimantName: z.string().optional(),
    claimantSSN: z.string().optional(),
    claimantAddress: z.string().optional(),
    claimantPhone: z.string().optional(),
    claimantEmail: z.string().email().optional(),
    branch: z.string().min(1, "Branch of service is required"),
    serviceDates: z.string().min(1, "Service dates are required"),
    deployments: z.string().optional(),
    disability: z.string().min(1, "Disability description is required"),
    relationToService: z.string().min(1, "Relation to service is required"),
    traumaticEvents: z.string().optional(),
    witnessName: z.string().optional(),
    witnessRelationship: z.string().optional(),
    witnessPhone: z.string().optional(),
    witnessEmail: z.string().email().optional(),
  }),
  "21-4138": z.object({
    veteranName: z.string().min(1, "Veteran's name is required"),
    veteranSSN: z.string().min(1, "Veteran's SSN is required"),
    veteranDateOfBirth: z.string().min(1, "Date of birth is required"),
    veteranAddress: z.string().min(1, "Address is required"),
    veteranPhone: z.string().min(1, "Phone number is required"),
    veteranEmail: z.string().email().optional(),
    statement: z.string().min(1, "Statement is required"),
  }),
};

export const stepFields = {
  "21-0781": [
    ["veteranName", "veteranSSN", "veteranDateOfBirth", "veteranAddress", "veteranPhone", "veteranEmail"],
    ["branch", "serviceDates"],
    ["traumaticEvents"],
    [],
  ],
  "21-10210": [
    ["veteranName", "veteranSSN", "veteranDateOfBirth", "veteranAddress", "veteranPhone", "veteranEmail"],
    ["claimantName", "claimantSSN", "claimantAddress", "claimantPhone", "claimantEmail"],
    ["branch", "serviceDates", "deployments"],
    ["disability", "relationToService", "traumaticEvents", "witnessName", "witnessRelationship", "witnessPhone", "witnessEmail"],
    [],
  ],
  "21-4138": [
    ["veteranName", "veteranSSN", "veteranDateOfBirth", "veteranAddress", "veteranPhone", "veteranEmail"],
    ["statement"],
    [],
  ],
};
```

### Step 3.2: Integrate React Hook Form

In `MultiStepForm.tsx`, use React Hook Form with Zod (included in Step 2.2).

### Step 3.3: Navigation Logic

Implement navigation in `MultiStepForm.tsx` (included in Step 2.2).

## Phase 4: API Integration

Set up a mock API for statement generation.

### Step 4.1: Create Mock API Route

Create `app/api/generate-documents/route.ts`:

```tsx
// app/api/generate-documents/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { formType } = await req.json();
  return NextResponse.json({ text: `Mock generated statement for VA Form ${formType}` });
}
```

### Step 4.2: Handle Submission

Handle form submission in `MultiStepForm.tsx` (included in Step 2.2).

## Phase 5: PDF Export

Export form data to VA PDFs using `pdf-lib`.

### Step 5.1: Inspect PDF Fields

Use a tool like Adobe Acrobat or `pdf-lib`’s `form.getFields()` to identify field names (e.g., `Veteran_Name`, `Statement`). Example mappings:

- 21-0781: `Veteran_Name`, `SSN`, `Incident_Description`.
- 21-10210: `Veteran_Name`, `Witness_Name`, `Statement`.
- 21-4138: `Veteran_Name`, `Statement`.

### Step 5.2: Create PDF Fill APIs

Example for 21-0781:

```tsx
// app/api/fill-va-form-21-0781/route.ts
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const formPath = path.join(process.cwd(), "public", "VBA-21-0781-ARE.pdf");
    const pdfBytes = await fs.readFile(formPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField("Veteran_Name").setText(data.veteranName);
    form.getTextField("SSN").setText(data.veteranSSN);
    form.getTextField("DOB").setText(data.veteranDateOfBirth);
    form.getTextField("Address").setText(data.veteranAddress);
    form.getTextField("Phone").setText(data.veteranPhone);
    form.getTextField("Email").setText(data.veteranEmail || "");
    form.getTextField("Branch").setText(data.branch);
    form.getTextField("Service_Dates").setText(data.serviceDates);
    form.getTextField("Incident_Description").setText(data.statement || data.traumaticEvents);

    const filledPdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(filledPdfBytes), {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    console.error("Error filling PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
```

Create similar routes for `21-10210` and `21-4138`, adjusting field mappings based on each form’s PDF structure.

### Step 5.3: Download PDF

Handle PDF download in `MultiStepForm.tsx` (included in Step 2.2).

## Phase 6: Mock Data and Testing

Use mock data for safe development and testing.

### Step 6.1: Define Mock Data

Create `app/lib/mockData.ts`:

```tsx
// app/lib/mockData.ts
export const mockData = {
  "21-0781": {
    veteranName: "John Doe",
    veteranSSN: "123-45-6789",
    veteranDateOfBirth: "1980-01-01",
    veteranAddress: "123 Main St, Anytown, USA",
    veteranPhone: "555-123-4567",
    veteranEmail: "john.doe@example.com",
    branch: "Army",
    serviceDates: "2000-2004",
    traumaticEvents: "Witnessed explosion in Iraq, 2003",
  },
  "21-10210": {
    veteranName: "Emily Davis",
    veteranSSN: "321-54-9876",
    veteranDateOfBirth: "1990-11-11",
    veteranAddress: "321 Elm St, Anytown, USA",
    veteranPhone: "555-321-6547",
    veteranEmail: "emily.davis@example.com",
    claimantName: "",
    claimantSSN: "",
    claimantAddress: "",
    claimantPhone: "",
    claimantEmail: "",
    branch: "Air Force",
    serviceDates: "2010-2014",
    deployments: "Afghanistan, 2012",
    disability: "PTSD",
    relationToService: "Exposure to combat",
    traumaticEvents: "IED attack in 2012",
    witnessName: "Michael Brown",
    witnessRelationship: "Friend",
    witnessPhone: "555-654-3210",
    witnessEmail: "michael.brown@example.com",
  },
  "21-4138": {
    veteranName: "Jane Smith",
    veteranSSN: "987-65-4321",
    veteranDateOfBirth: "1975-06-15",
    veteranAddress: "456 Oak Ave, Anytown, USA",
    veteranPhone: "555-987-6543",
    veteranEmail: "jane.smith@example.com",
    statement: "My service-connected back injury limits my ability to work.",
  },
};
```

### Step 6.2: Implement Mock Data Loader

Create `app/components/MockDataLoader.tsx`:

```tsx
// app/components/MockDataLoader.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { mockData } from "@/lib/mockData";

export function MockDataLoader({ formType }: { formType: string }) {
  const { setValue } = useFormContext();
  if (process.env.NODE_ENV !== "development") return null;

  const loadMockData = () => {
    const data = mockData[formType as keyof typeof mockData];
    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value);
    });
  };

  return (
    <Button variant="outline" onClick={loadMockData} className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-100">
      Load Mock Data
    </Button>
  );
}
```

### Step 6.3: Set Up MSW for API Mocking

Create `app/mocks/handlers.ts`:

```tsx
// app/mocks/handlers.ts
import { rest } from "msw";

export const handlers = [
  rest.post("/api/generate-documents", async (req, res, ctx) => {
    const { formType } = await req.json();
    return res(ctx.json({ text: `Mock generated statement for VA Form ${formType}` }));
  }),
];
```

Create `app/mocks/index.ts`:

```tsx
// app/mocks/index.ts
import { setupWorker } from "msw";
import { handlers } from "./handlers";

if (process.env.NODE_ENV === "development") {
  const worker = setupWorker(...handlers);
  worker.start();
}
```

Update `app/layout.tsx` to include MSW in development:

```tsx
// app/layout.tsx
import './globals.css';
import "../mocks";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Step 6.4: Test with Mock Data

Run `npm run dev`, navigate to `/dashboard/statement-generator`, select each form type, load mock data, and verify:

- Form navigation and validation.
- Mock API response display.
- PDF export functionality.

## Phase 7: Accessibility and Responsiveness

Ensure the tool is usable for all veterans.

### Step 7.1: ARIA Support

Use Shadcn UI and Radix UI components, which include ARIA attributes. Verify that form fields have associated labels and error messages are announced to screen readers.

### Step 7.2: Responsive Design

Apply Tailwind CSS v4 classes for responsiveness:

- Stepper: `flex-col sm:flex-row` for mobile stacking.
- Inputs: `text-sm sm:text-base` for font size adjustments.
- Cards: `w-full` for mobile, `max-w-2xl` for desktop.
- Layout: `p-4` for padding, `mx-auto` for centering.

Example in `MultiStepForm.tsx` (Step 2.2) shows responsive stepper and container classes.

### Step 7.3: Accessibility Testing

Use axe DevTools to ensure WCAG compliance. Test:

- Keyboard navigation (e.g., tab through form fields and buttons).
- Screen reader support (e.g., NVDA or VoiceOver).
- High-contrast colors (`text-gray-700` on `bg-white`, `text-white` on `bg-blue-500`).

## 

Make notes for this portion that will use mock data and sessions until specified to move to production

### Step 8.1: Production Preparation for the future 

Disable mock data and MSW in production by checking `process.env.NODE_ENV`. If using a real AI service, configure environment variables for API endpoints in `.env.local` and `.env.production`:

Update `onSubmit` in `MultiStepForm.tsx` to use the real API if applicable.

### 

Ensure your dashboard navigation includes a link to `/dashboard/statement-generator`, e.g., in a sidebar or menu with a document icon.

## User Stories

### User Story 1: Generating a PTSD Statement

- **As a** veteran with PTSD,
- **I want to** generate a VA Form 21-0781 statement,
- **So that** I can document traumatic events for my claim.
- **Steps**:
  1. Navigate to `/dashboard/statement-generator` from the dashboard.
  2. Select "VA Form 21-0781" from the dropdown.
  3. Enter veteran information (name, SSN, etc.).
  4. Provide service history (branch, dates).
  5. Describe traumatic events, guided by tooltips.
  6. Review the AI-generated statement.
  7. Click "Export to VA Form" to download the filled PDF.

### User Story 2: Providing a Lay/Witness Statement

- **As a** friend of a veteran,
- **I want to** submit a VA Form 21-10210 statement,
- **So that** I can support their claim.
- **Steps**:
  1. Access `/dashboard/statement-generator`.
  2. Select "VA Form 21-10210".
  3. Enter veteran and claimant information.
  4. Provide service history and condition details, including witness observations.
  5. Review the generated statement.
  6. Export the filled PDF.

### User Story 3: Submitting a General Statement

- **As a** veteran,
- **I want to** provide a VA Form 21-4138 statement,
- **So that** I can add supporting information.
- **Steps**:
  1. Go to `/dashboard/statement-generator`.
  2. Select "VA Form 21-4138".
  3. Enter veteran information.
  4. Write a general statement (e.g., impact of injury).
  5. Review and export the filled PDF.

## 