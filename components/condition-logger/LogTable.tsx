"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronDown,
  Search,
  Filter,
  Calendar,
  Clock,
  Trash2,
  Edit,
  AlertCircle,
  MoreHorizontal,
  FileText,
  Download,
  Printer
} from "lucide-react";
import { Condition } from "@/lib/conditions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface LogTableProps {
  logs: Log[];
  conditions: Condition[];
  onEdit?: (log: Log) => void;
  onDelete?: (log: Log) => void;
  onExport?: (logs: Log[]) => void;
}

export function LogTable({ logs, conditions, onEdit, onDelete, onExport }: LogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedProstratingOnly, setSelectedProstratingOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "timestamp",
    direction: "descending"
  });

  // Get unique severity values for filtering
  const severityOptions = useMemo(() => {
    const severities = new Set<string>();
    logs.forEach((log) => {
      if (log.data.severity) {
        severities.add(log.data.severity.toString());
      }
    });
    return Array.from(severities).sort((a, b) => parseInt(a) - parseInt(b));
  }, [logs]);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((log) => {
        // Search in notes
        if (log.data.notes && log.data.notes.toLowerCase().includes(lowercasedSearch)) {
          return true;
        }

        // Search in triggers
        if (log.data.triggers && Array.isArray(log.data.triggers)) {
          if (
            log.data.triggers.some((trigger) => trigger.toLowerCase().includes(lowercasedSearch))
          ) {
            return true;
          }
        }

        // Search in other data fields
        for (const key in log.data) {
          const value = log.data[key];
          if (typeof value === "string" && value.toLowerCase().includes(lowercasedSearch)) {
            return true;
          }
        }

        // Search in condition name
        return log.condition.toLowerCase().includes(lowercasedSearch);
      });
    }

    // Apply condition filter
    if (selectedCondition) {
      filtered = filtered.filter((log) => log.condition === selectedCondition);
    }

    // Apply severity filter
    if (selectedSeverity) {
      filtered = filtered.filter((log) => log.data.severity?.toString() === selectedSeverity);
    }

    // Apply prostrating filter
    if (selectedProstratingOnly) {
      filtered = filtered.filter((log) => log.data.prostrating === "Yes");
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === "timestamp") {
        aValue = new Date(a.timestamp).getTime();
        bValue = new Date(b.timestamp).getTime();
      } else if (sortConfig.key === "severity") {
        aValue = parseInt(a.data.severity || "0");
        bValue = parseInt(b.data.severity || "0");
      } else if (sortConfig.key === "duration") {
        // Handle duration in various formats
        if (typeof a.data.duration === "number") {
          aValue = a.data.duration;
        } else if (typeof a.data.duration === "string") {
          const match = a.data.duration.match(/(\d+)/);
          aValue = match ? parseInt(match[1]) : 0;
        } else {
          aValue = 0;
        }

        if (typeof b.data.duration === "number") {
          bValue = b.data.duration;
        } else if (typeof b.data.duration === "string") {
          const match = b.data.duration.match(/(\d+)/);
          bValue = match ? parseInt(match[1]) : 0;
        } else {
          bValue = 0;
        }
      } else {
        aValue = a.data[sortConfig.key] || "";
        bValue = b.data[sortConfig.key] || "";
      }

      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [logs, searchTerm, selectedCondition, selectedSeverity, selectedProstratingOnly, sortConfig]);

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending"
    }));
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Get condition name by ID
  const getConditionName = (conditionId: string) => {
    const condition = conditions.find((c) => c.id === conditionId);
    return condition ? condition.name : conditionId;
  };

  // Get severity color
  const getSeverityColor = (severity: string | number) => {
    const severityNum = typeof severity === "string" ? parseInt(severity) : severity;
    if (severityNum >= 8) return "bg-red-500 text-white";
    if (severityNum >= 6) return "bg-orange-500 text-white";
    if (severityNum >= 4) return "bg-yellow-500";
    return "bg-green-500 text-white";
  };

  // Get prostrating badge
  const getProstratingBadge = (prostrating: string) => {
    if (prostrating === "Yes") {
      return (
        <Badge variant="destructive" className="ml-2">
          Prostrating
        </Badge>
      );
    }
    return null;
  };

  // Get impact badge
  const getImpactBadge = (impact: string) => {
    if (!impact) return null;

    if (impact.includes("Complete inability")) {
      return (
        <Badge variant="destructive" className="ml-2">
          Complete Impact
        </Badge>
      );
    }
    if (impact.includes("Severe")) {
      return (
        <Badge variant="destructive" className="ml-2">
          Severe Impact
        </Badge>
      );
    }
    if (impact.includes("Moderate")) {
      return (
        <Badge variant="default" className="ml-2">
          Moderate Impact
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="ml-2">
        Mild Impact
      </Badge>
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCondition(null);
    setSelectedSeverity(null);
    setSelectedProstratingOnly(false);
  };

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="flex items-center text-lg font-medium">
            <FileText className="mr-2 h-5 w-5" />
            Log History
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport && onExport(filteredLogs)}
              className="h-8">
              <Download className="mr-1 h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8">
              <Printer className="mr-1 h-3.5 w-3.5" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-3">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {(selectedCondition || selectedSeverity || selectedProstratingOnly) && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {(selectedCondition ? 1 : 0) +
                          (selectedSeverity ? 1 : 0) +
                          (selectedProstratingOnly ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <p className="mb-2 text-xs font-medium">Condition</p>
                    <div className="space-y-2">
                      {conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`condition-${condition.id}`}
                            checked={selectedCondition === condition.id}
                            onCheckedChange={() =>
                              setSelectedCondition(
                                selectedCondition === condition.id ? null : condition.id
                              )
                            }
                          />
                          <Label htmlFor={`condition-${condition.id}`} className="text-sm">
                            {condition.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <p className="mb-2 text-xs font-medium">Severity</p>
                    <div className="grid grid-cols-5 gap-1">
                      {severityOptions.map((severity) => (
                        <div
                          key={severity}
                          className={`cursor-pointer rounded-md border p-1 text-center text-xs ${
                            selectedSeverity === severity
                              ? "border-primary bg-primary/10"
                              : "border-muted"
                          }`}
                          onClick={() =>
                            setSelectedSeverity(selectedSeverity === severity ? null : severity)
                          }>
                          {severity}
                        </div>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="prostrating-filter"
                        checked={selectedProstratingOnly}
                        onCheckedChange={() => setSelectedProstratingOnly(!selectedProstratingOnly)}
                      />
                      <Label htmlFor="prostrating-filter" className="text-sm">
                        Prostrating attacks only
                      </Label>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort("timestamp")}>
                    Date {getSortDirectionIndicator("timestamp")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("severity")}>
                    Severity {getSortDirectionIndicator("severity")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("duration")}>
                    Duration {getSortDirectionIndicator("duration")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {filteredLogs.length} {filteredLogs.length === 1 ? "log" : "logs"} found
              {filteredLogs.length < logs.length && <> (filtered from {logs.length})</>}
            </p>
          </div>
        </div>

        <div className="rounded-md border">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="bg-card sticky top-0">
                <TableRow>
                  <TableHead className="w-[180px]" onClick={() => handleSort("timestamp")}>
                    <div className="flex cursor-pointer items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date {getSortDirectionIndicator("timestamp")}
                    </div>
                  </TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead
                    className="w-[100px] text-center"
                    onClick={() => handleSort("severity")}>
                    <div className="flex cursor-pointer items-center justify-center">
                      Severity {getSortDirectionIndicator("severity")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[100px] text-center"
                    onClick={() => handleSort("duration")}>
                    <div className="flex cursor-pointer items-center justify-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Duration {getSortDirectionIndicator("duration")}
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No logs found.
                      {(searchTerm ||
                        selectedCondition ||
                        selectedSeverity ||
                        selectedProstratingOnly) && (
                        <div className="mt-2">
                          <Button variant="link" onClick={clearFilters} className="h-auto p-0">
                            Clear filters
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="align-top font-medium">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1">
                            <Badge variant="outline">{getConditionName(log.condition)}</Badge>
                            {log.data.prostrating === "Yes" &&
                              getProstratingBadge(log.data.prostrating)}
                            {log.data.impact && getImpactBadge(log.data.impact)}
                          </div>

                          {log.data.triggers &&
                            Array.isArray(log.data.triggers) &&
                            log.data.triggers.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {log.data.triggers.map((trigger: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {trigger}
                                  </Badge>
                                ))}
                              </div>
                            )}

                          {log.data.notes && (
                            <p className="text-muted-foreground text-sm">
                              {log.data.notes.length > 100
                                ? `${log.data.notes.substring(0, 100)}...`
                                : log.data.notes}
                            </p>
                          )}

                          {log.data.medications && (
                            <div className="text-muted-foreground flex items-center text-xs">
                              <span className="mr-1 font-medium">Medications:</span>
                              {log.data.medications}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${getSeverityColor(
                                  log.data.severity || "0"
                                )}`}>
                                {log.data.severity || "-"}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Pain level: {log.data.severity || "Not specified"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-center">{log.data.duration || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit && onEdit(log)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete && onDelete(log)}
                              className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
