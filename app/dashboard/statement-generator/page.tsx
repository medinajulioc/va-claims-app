import { Metadata } from "next";
import { MultiStepForm } from "@/app/components/statement-generator/MultiStepForm";
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, InfoIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Statement Generator | VA Claims App",
  description: "Generate statements for VA forms to support your claims"
};

export default function StatementGeneratorPage() {
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="mb-3 flex items-center text-2xl font-bold">
          <FileTextIcon className="text-primary mr-2 h-6 w-6" />
          Statement Generator
        </h1>
        <p className="text-muted-foreground">
          Generate draft VA statements for your claims. Always review with a VA-accredited
          professional before submission.
        </p>
      </div>

      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-4 text-amber-800">
          <InfoIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Important Information</p>
            <p className="text-sm">
              This tool helps create draft statements for VA forms. Follow the step-by-step process,
              providing accurate information at each stage. You can navigate between steps, save
              your progress, and generate a final statement that can be exported to the appropriate
              VA form.
            </p>
          </div>
        </CardContent>
      </Card>

      <MultiStepForm />
    </div>
  );
}
