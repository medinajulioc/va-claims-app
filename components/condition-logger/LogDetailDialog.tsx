"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface LogDetailDialogProps {
  log: Log | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogDetailDialog = ({ log, open, onOpenChange }: LogDetailDialogProps) => {
  if (!log) return null;

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return timestamp;
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "destructive";
    if (severity >= 5) return "warning";
    return "secondary";
  };

  // Print log details
  const handlePrint = () => {
    const printContent = `
      Condition Log Details
      --------------------
      Condition: ${log.condition}
      Date: ${formatDate(log.timestamp)}
      ${Object.entries(log.data)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join("\n")}
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Condition Log - ${log.condition}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { margin-bottom: 10px; }
              .date { color: #666; margin-bottom: 20px; }
              .detail { margin: 5px 0; }
              .severity { font-weight: bold; }
              .notes { margin-top: 20px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${log.condition} Log</h1>
            <div class="date">${formatDate(log.timestamp)}</div>
            ${Object.entries(log.data)
              .map(([key, value]) => {
                if (key === "severity") {
                  return `<div class="detail severity">Severity: ${value}/10</div>`;
                } else if (key === "notes") {
                  return `<div class="notes"><strong>Notes:</strong><br>${value}</div>`;
                } else {
                  return `<div class="detail"><strong>${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }:</strong> ${value}</div>`;
                }
              })
              .join("")}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{log.condition} Log</span>
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print log</span>
            </Button>
          </DialogTitle>
          <DialogDescription>{formatDate(log.timestamp)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {log.data.severity && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Severity:</span>
              <Badge variant={getSeverityColor(log.data.severity)}>{log.data.severity}/10</Badge>
            </div>
          )}

          {/* Display all other data fields except notes */}
          {Object.entries(log.data)
            .filter(([key]) => !["severity", "notes"].includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span>{value}</span>
              </div>
            ))}

          {/* Display notes at the bottom with more space */}
          {log.data.notes && (
            <div className="space-y-2 pt-4">
              <span className="font-medium">Notes:</span>
              <div className="bg-muted rounded-md p-3 text-sm">{log.data.notes}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
