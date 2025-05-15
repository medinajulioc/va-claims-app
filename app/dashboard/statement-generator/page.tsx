import { Metadata } from "next";
import { MultiStepForm } from "@/app/components/statement-generator/MultiStepForm";

export const metadata: Metadata = {
  title: "Statement Generator | VA Claims App",
  description: "Generate statements for VA forms to support your claims"
};

export default function StatementGeneratorPage() {
  return (
    <div className="py-6">
      <h1 className="mb-6 text-2xl font-bold">Statement Generator</h1>
      <p className="text-muted-foreground mb-6">
        Generate draft VA statements for your claims. Always review with a VA-accredited
        professional before submission.
      </p>
      <MultiStepForm />
    </div>
  );
}
