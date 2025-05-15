"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewFormProps {
  generatedText: string;
  handleExportPDF: () => void;
  isLoading: boolean;
}

export function ReviewForm({ generatedText, handleExportPDF, isLoading }: ReviewFormProps) {
  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Review Generated Statement</CardTitle>
      </CardHeader>
      <CardContent>
        {generatedText ? (
          <div>
            <p className="text-muted-foreground mb-4">
              Please review the generated statement below. You can export it as a filled-out VA
              form.
            </p>
            <Textarea value={generatedText} readOnly className="border-border min-h-[200px]" />
            <Button onClick={handleExportPDF} disabled={isLoading} className="mt-4">
              {isLoading ? "Generating PDF..." : "Export to VA Form"}
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">Click "Generate Statement" to create your draft.</p>
        )}
      </CardContent>
    </Card>
  );
}
