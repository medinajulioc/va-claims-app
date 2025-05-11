"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Plus, Save, Trash2, FileText } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import { NotificationType } from "@/types/notifications";

// Define template interfaces
interface Template {
  id: string;
  name: string;
  content: string;
  description: string;
  type: NotificationType;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  type: z.string(),
  variables: z.string()
});

type FormValues = z.infer<typeof formSchema>;

// Mock template data
const mockTemplates: Template[] = [
  {
    id: "template-1",
    name: "Claim Status Update",
    content: "Your claim status has been updated to {{status}}. {{details}}",
    description: "Used when a claim status changes",
    type: NotificationType.CLAIM_UPDATE,
    variables: ["status", "details"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-04-22")
  },
  {
    id: "template-2",
    name: "Document Request",
    content:
      "Please submit {{document_name}} within {{days}} days to continue processing your claim.",
    description: "Used to request document submission",
    type: NotificationType.DOCUMENT,
    variables: ["document_name", "days"],
    createdAt: new Date("2024-02-03"),
    updatedAt: new Date("2024-03-12")
  },
  {
    id: "template-3",
    name: "Appointment Reminder",
    content:
      "Reminder: You have an appointment scheduled for {{date}} at {{time}} at {{location}}.",
    description: "Sent before scheduled appointments",
    type: NotificationType.APPOINTMENT,
    variables: ["date", "time", "location"],
    createdAt: new Date("2024-02-18"),
    updatedAt: new Date("2024-02-18")
  },
  {
    id: "template-4",
    name: "System Maintenance",
    content:
      "The VA Claims system will be undergoing maintenance on {{date}} from {{start_time}} to {{end_time}}. Services will be unavailable during this time.",
    description: "Used for system maintenance announcements",
    type: NotificationType.SYSTEM,
    variables: ["date", "start_time", "end_time"],
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05")
  }
];

export default function NotificationTemplates() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      description: "",
      type: NotificationType.SYSTEM.toString(),
      variables: ""
    }
  });

  // Open the dialog for creating a new template
  const handleCreateTemplate = () => {
    form.reset({
      name: "",
      content: "",
      description: "",
      type: NotificationType.SYSTEM.toString(),
      variables: ""
    });
    setSelectedTemplate(null);
    setIsDialogOpen(true);
  };

  // Open the dialog for editing an existing template
  const handleEditTemplate = (template: Template) => {
    form.reset({
      name: template.name,
      content: template.content,
      description: template.description,
      type: template.type.toString(),
      variables: template.variables.join(", ")
    });
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  // Duplicate a template
  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTemplates([...templates, newTemplate]);

    toast({
      title: "Template duplicated",
      description: `"${template.name}" has been duplicated.`
    });
  };

  // Delete a template
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((template) => template.id !== templateId));

    toast({
      title: "Template deleted",
      description: "The template has been deleted."
    });
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    const variables = data.variables.split(",").map((variable) => variable.trim());

    if (selectedTemplate) {
      // Update existing template
      const updatedTemplates = templates.map((template) => {
        if (template.id === selectedTemplate.id) {
          return {
            ...template,
            name: data.name,
            content: data.content,
            description: data.description,
            type: data.type as NotificationType,
            variables,
            updatedAt: new Date()
          };
        }
        return template;
      });

      setTemplates(updatedTemplates);

      toast({
        title: "Template updated",
        description: "Your template has been updated."
      });
    } else {
      // Create new template
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: data.name,
        content: data.content,
        description: data.description,
        type: data.type as NotificationType,
        variables,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setTemplates([...templates, newTemplate]);

      toast({
        title: "Template created",
        description: "Your new template has been created."
      });
    }

    setIsDialogOpen(false);
  };

  // Generate preview content
  const handlePreview = () => {
    const content = form.getValues("content");

    // Replace template variables with sample values
    const processedContent = content
      .replace(/{{status}}/g, "Approved")
      .replace(/{{details}}/g, "You will receive payment details within 5-7 business days.")
      .replace(/{{document_name}}/g, "DD-214 Form")
      .replace(/{{days}}/g, "30")
      .replace(/{{date}}/g, "June 15, 2024")
      .replace(/{{time}}/g, "10:00 AM")
      .replace(/{{location}}/g, "VA Medical Center - Building 2, Room 305")
      .replace(/{{start_time}}/g, "2:00 AM")
      .replace(/{{end_time}}/g, "6:00 AM");

    setPreviewContent(processedContent);
  };

  // Get type label
  const getTypeLabel = (type: NotificationType) => {
    return type
      .toString()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>Manage reusable notification templates</CardDescription>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {templates.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center p-8 text-center">
            <FileText className="text-muted-foreground/50 mb-2 h-12 w-12" />
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-sm">Create your first notification template</p>
            <Button className="mt-4" onClick={handleCreateTemplate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full w-1 ${
                    template.type === NotificationType.CLAIM_UPDATE
                      ? "bg-blue-500"
                      : template.type === NotificationType.DOCUMENT
                        ? "bg-amber-500"
                        : template.type === NotificationType.APPOINTMENT
                          ? "bg-green-500"
                          : template.type === NotificationType.MESSAGE
                            ? "bg-purple-500"
                            : template.type === NotificationType.SYSTEM
                              ? "bg-gray-500"
                              : template.type === NotificationType.DEADLINE
                                ? "bg-red-500"
                                : "bg-blue-500"
                  }`}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground bg-muted rounded-md p-3 font-mono text-sm">
                    {template.content}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground text-xs">
                      Type: <span className="font-medium">{getTypeLabel(template.type)}</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Variables:{" "}
                      <span className="font-medium">{template.variables.join(", ")}</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Updated: {template.updatedAt.toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? "Update your notification template details below."
                : "Fill in the details to create a new notification template."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NotificationType.CLAIM_UPDATE.toString()}>
                            Claim Update
                          </SelectItem>
                          <SelectItem value={NotificationType.DOCUMENT.toString()}>
                            Document
                          </SelectItem>
                          <SelectItem value={NotificationType.APPOINTMENT.toString()}>
                            Appointment
                          </SelectItem>
                          <SelectItem value={NotificationType.MESSAGE.toString()}>
                            Message
                          </SelectItem>
                          <SelectItem value={NotificationType.SYSTEM.toString()}>System</SelectItem>
                          <SelectItem value={NotificationType.DEADLINE.toString()}>
                            Deadline
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter template content"
                          className="min-h-24 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use {{ variable_name }} syntax for dynamic content (e.g., {{ date }},{" "}
                        {{ status }}).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="variables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variables</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter variables separated by commas" {...field} />
                      </FormControl>
                      <FormDescription>
                        List of variables used in the template, separated by commas (e.g., status,
                        details, date).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.getValues("content") && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Preview</div>
                      <Button type="button" variant="outline" size="sm" onClick={handlePreview}>
                        Refresh Preview
                      </Button>
                    </div>
                    <div className="mt-2 rounded-md border p-3 text-sm">
                      {previewContent || "Click 'Refresh Preview' to see how your template looks."}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {selectedTemplate ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
