"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, FileText, FileCode, Filter } from "lucide-react";
import { FineTuningDocument, documentCategories } from "../data";

interface DocumentSelectorProps {
  documents: FineTuningDocument[];
  selectedDocuments: string[];
  onSelectDocument: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function DocumentSelector({
  documents,
  selectedDocuments,
  onSelectDocument,
  onSelectAll
}: DocumentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.contentPreview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const allSelected =
    filteredDocuments.length > 0 &&
    filteredDocuments.every((doc) => selectedDocuments.includes(doc.id));

  const handleSelectAll = () => {
    onSelectAll(!allSelected);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "DOCX":
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <FileCode className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Documents for Fine-Tuning</CardTitle>
        <CardDescription>
          Choose the documents to include in your fine-tuning dataset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all documents"
                    />
                  </TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                  <TableHead className="hidden lg:table-cell">Date Added</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={(checked) => onSelectDocument(doc.id, !!checked)}
                          aria-label={`Select ${doc.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{doc.name}</span>
                          <span className="text-muted-foreground hidden text-sm sm:block lg:hidden">
                            {doc.category}
                          </span>
                          <span className="text-muted-foreground hidden text-xs lg:hidden">
                            {doc.dateAdded}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.type)}
                          <span>{doc.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{doc.size}</TableCell>
                      <TableCell className="hidden lg:table-cell">{doc.dateAdded}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between">
            <div className="text-muted-foreground text-sm">
              {selectedDocuments.length} documents selected
            </div>
            <Button size="sm" disabled={selectedDocuments.length === 0}>
              Preview Selected
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
