"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";
import { FilterBar, FilterOptions } from "./FilterBar";
import { ReportGenerator } from "./ReportGenerator";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface LogTableProps {
  logs: Log[];
  selectedCondition?: string;
  onDeleteLog: (id: string) => void;
  onViewDetails: (log: Log) => void;
}

export const LogTable = ({
  logs,
  selectedCondition,
  onDeleteLog,
  onViewDetails
}: LogTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(5);
  const [filters, setFilters] = useState<FilterOptions>({
    condition: selectedCondition || null,
    dateRange: {
      from: null,
      to: null
    },
    severityRange: {
      min: null,
      max: null
    },
    searchText: "",
    sortBy: "newest"
  });
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);

  // Update filters when selectedCondition prop changes
  useEffect(() => {
    if (selectedCondition !== undefined) {
      setFilters((prev) => ({
        ...prev,
        condition: selectedCondition
      }));
    }
  }, [selectedCondition]);

  // Apply filters and sorting to logs
  useEffect(() => {
    let result = [...logs];

    // Filter by condition
    if (filters.condition) {
      result = result.filter((log) => log.condition === filters.condition);
    }

    // Filter by date range
    if (filters.dateRange.from) {
      result = result.filter((log) => new Date(log.timestamp) >= filters.dateRange.from!);
    }

    if (filters.dateRange.to) {
      // Set time to end of day for "to" date
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);

      result = result.filter((log) => new Date(log.timestamp) <= toDate);
    }

    // Filter by severity range
    if (filters.severityRange.min !== null) {
      result = result.filter((log) => log.data.severity >= filters.severityRange.min);
    }

    if (filters.severityRange.max !== null) {
      result = result.filter((log) => log.data.severity <= filters.severityRange.max);
    }

    // Filter by search text
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      result = result.filter((log) => {
        // Search in condition name
        if (log.condition.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in notes
        if (log.data.notes && log.data.notes.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in other data fields
        return Object.entries(log.data).some(
          ([key, value]) => typeof value === "string" && value.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case "severity-high":
        result.sort((a, b) => {
          const severityA = a.data.severity || 0;
          const severityB = b.data.severity || 0;
          return severityB - severityA;
        });
        break;
      case "severity-low":
        result.sort((a, b) => {
          const severityA = a.data.severity || 0;
          const severityB = b.data.severity || 0;
          return severityA - severityB;
        });
        break;
    }

    setFilteredLogs(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [logs, filters]);

  // Calculate pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy h:mm a");
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {selectedCondition ? `${selectedCondition} Logs` : "All Condition Logs"}
        </h3>
        <ReportGenerator logs={logs} />
      </div>

      <FilterBar onFilterChange={setFilters} selectedCondition={selectedCondition} />

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {filteredLogs.length} {filteredLogs.length === 1 ? "log" : "logs"} found
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Rows per page:</span>
          <Select
            value={logsPerPage.toString()}
            onValueChange={(value) => {
              setLogsPerPage(parseInt(value, 10));
              setCurrentPage(1);
            }}>
            <SelectTrigger className="h-8 w-16">
              <SelectValue placeholder={logsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-card rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            {filters.searchText
              ? "No logs match your search criteria"
              : selectedCondition
                ? `No logs found for ${selectedCondition}`
                : "No logs found"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableCaption>
              Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of{" "}
              {filteredLogs.length} logs
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{log.condition}</TableCell>
                  <TableCell>
                    {log.data.severity && (
                      <Badge variant={getSeverityColor(log.data.severity)}>
                        {log.data.severity}/10
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.data.notes || "No details provided"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(log)}
                        aria-label="View details">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteLog(log.id)}
                        aria-label="Delete log">
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isActive={currentPage > 1}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                isActive={currentPage < totalPages}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
