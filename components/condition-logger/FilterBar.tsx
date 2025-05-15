"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { format } from "date-fns";
import { conditions } from "@/lib/conditions";

export type FilterOptions = {
  condition: string | null;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  severityRange: {
    min: number | null;
    max: number | null;
  };
  searchText: string;
  sortBy: "newest" | "oldest" | "severity-high" | "severity-low";
};

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  selectedCondition?: string | null;
}

export const FilterBar = ({ onFilterChange, selectedCondition }: FilterBarProps) => {
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

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Update filters when selectedCondition prop changes
  useEffect(() => {
    if (selectedCondition !== undefined) {
      setFilters((prev) => ({
        ...prev,
        condition: selectedCondition
      }));
    }
  }, [selectedCondition]);

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchText: e.target.value
    }));
  };

  const handleConditionChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      condition: value === "all" ? null : value
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value as FilterOptions["sortBy"]
    }));
  };

  const handleDateFromChange = (date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        from: date
      }
    }));
  };

  const handleDateToChange = (date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        to: date
      }
    }));
  };

  const handleSeverityMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setFilters((prev) => ({
      ...prev,
      severityRange: {
        ...prev.severityRange,
        min: value
      }
    }));
  };

  const handleSeverityMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setFilters((prev) => ({
      ...prev,
      severityRange: {
        ...prev.severityRange,
        max: value
      }
    }));
  };

  const resetFilters = () => {
    setFilters({
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
    setIsAdvancedOpen(false);
  };

  // Count active filters (excluding condition if it's the selected condition)
  const activeFilterCount = [
    filters.dateRange.from,
    filters.dateRange.to,
    filters.severityRange.min,
    filters.severityRange.max,
    filters.searchText,
    filters.condition !== selectedCondition && filters.condition !== null ? 1 : 0
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="pl-8"
            value={filters.searchText}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="severity-high">Highest severity</SelectItem>
              <SelectItem value="severity-low">Lowest severity</SelectItem>
            </SelectContent>
          </Select>
          <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Advanced
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Filters</h4>
                  <p className="text-muted-foreground text-sm">Narrow down your log entries</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={filters.condition || "all"}
                      onValueChange={handleConditionChange}>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="All conditions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All conditions</SelectItem>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.name} value={condition.name}>
                            {condition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange.from ? (
                              format(filters.dateRange.from, "MMM d, yyyy")
                            ) : (
                              <span>From date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from || undefined}
                            onSelect={handleDateFromChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange.to ? (
                              format(filters.dateRange.to, "MMM d, yyyy")
                            ) : (
                              <span>To date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to || undefined}
                            onSelect={handleDateToChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Severity range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="Min"
                          value={filters.severityRange.min || ""}
                          onChange={handleSeverityMinChange}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="Max"
                          value={filters.severityRange.max || ""}
                          onChange={handleSeverityMaxChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={resetFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Reset filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
