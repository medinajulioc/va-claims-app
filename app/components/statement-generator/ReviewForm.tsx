"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2Icon, FileTextIcon, DownloadIcon } from "lucide-react";

interface ReviewFormProps {
  generatedText: string;
  handleExportPDF: () => void;
  isLoading: boolean;
}

export function ReviewForm({ generatedText, handleExportPDF, isLoading }: ReviewFormProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileTextIcon className="text-primary mr-2 h-5 w-5" />
          Review Generated Statement
        </CardTitle>
      </CardHeader>
      <CardContent>
        {generatedText ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <p className="text-muted-foreground mb-4">
              Please review the generated statement below. You can copy it to clipboard or export it
              as a filled-out VA form.
            </p>
            <div className="relative">
              <Textarea
                value={generatedText}
                readOnly
                className="border-border min-h-[200px] pr-10"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}>
                {copied ? (
                  <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
              </Button>
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={handleExportPDF}
                disabled={isLoading}
                className="flex-1 gap-2 transition-all duration-200 hover:scale-105">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    <span>Generating PDF...</span>
                  </div>
                ) : (
                  <>
                    <DownloadIcon className="h-4 w-4" />
                    Export to VA Form
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </div>
            <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium">Important:</p>
              <p>
                Always review this statement with a VA-accredited professional before submission.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-primary/10 mb-4 rounded-full p-4">
              <FileTextIcon className="text-primary h-8 w-8" />
            </div>
            <p className="text-muted-foreground">
              Click "Generate Statement" to create your draft.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
