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
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

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

  const formatFieldName = (name: string) => {
    // Convert camelCase to Title Case with spaces
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Print log details
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>${log.condition} Log - ${formatDate(log.timestamp)}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { margin-bottom: 5px; }
            .date { color: #666; margin-bottom: 20px; }
            .severity { font-weight: bold; margin-bottom: 15px; }
            .field { margin-bottom: 10px; }
            .field-name { font-weight: bold; }
            .notes { margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>${log.condition} Log</h1>
          <div class="date">${formatDate(log.timestamp)}</div>
          ${
            log.data.severity ? `<div class="severity">Severity: ${log.data.severity}/10</div>` : ""
          }
          ${Object.entries(log.data)
            .filter(([key]) => !["severity", "notes"].includes(key))
            .map(
              ([key, value]) => `
            <div class="field">
              <span class="field-name">${formatFieldName(key)}:</span> ${value}
            </div>
          `
            )
            .join("")}
          ${
            log.data.notes
              ? `<div class="notes">
                <div class="field-name">Notes:</div>
                <div>${log.data.notes}</div>
              </div>`
              : ""
          }
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {log.condition} Log Details
            </DialogTitle>
            <Button variant="outline" size="icon" onClick={handlePrint} className="h-8 w-8">
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print log</span>
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-2">
            <div className="flex flex-col space-y-1.5">
              <motion.div
                className="flex items-center justify-between"
                initial="hidden"
                animate="visible"
                variants={fadeIn}>
                <span className="text-muted-foreground text-sm">Logged on</span>
                <span className="font-medium">{formatDate(log.timestamp)}</span>
              </motion.div>

              {log.data.severity !== undefined && (
                <motion.div
                  className="flex items-center justify-between"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: 0.1 }}>
                  <span className="text-muted-foreground text-sm">Severity</span>
                  <Badge variant={getSeverityColor(log.data.severity)}>
                    {log.data.severity}/10
                  </Badge>
                </motion.div>
              )}
            </div>

            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.2 }}>
              <h3 className="border-b pb-2 text-lg font-medium">Recorded Symptoms</h3>

              <div className="grid gap-3">
                {Object.entries(log.data)
                  .filter(([key]) => key !== "severity" && key !== "notes") // Severity already displayed above
                  .map(([key, value], index) => (
                    <motion.div
                      key={key}
                      className="grid grid-cols-2 items-center gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}>
                      <span className="text-muted-foreground text-sm font-medium">
                        {formatFieldName(key)}
                      </span>
                      <span className="text-right break-words">
                        {typeof value === "string" ? value : JSON.stringify(value)}
                      </span>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {log.data.notes && (
              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.4 }}>
                <h3 className="border-b pb-2 text-lg font-medium">Notes</h3>
                <div className="bg-muted/50 rounded-md p-3 text-sm">{log.data.notes}</div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
