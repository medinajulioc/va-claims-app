"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Clock, Send, Users } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { NotificationType, Priority } from "@/types/notifications";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.string(),
  priority: z.string(),
  recipients: z.enum(["all", "specific", "group"]),
  recipientIds: z.string().optional(),
  recipientGroup: z.string().optional(),
  schedulingType: z.enum(["immediate", "scheduled", "recurring"]),
  scheduledDate: z.date().optional(),
  templateId: z.string().optional(),
  actions: z
    .array(
      z.object({
        type: z.string(),
        label: z.string(),
        url: z.string().optional(),
        apiEndpoint: z.string().optional()
      })
    )
    .optional()
});

type FormValues = z.infer<typeof formSchema>;

// Mock user groups
const userGroups = [
  { id: "veterans", name: "All Veterans" },
  { id: "active-claims", name: "Users with Active Claims" },
  { id: "new-users", name: "New Users (Last 30 Days)" },
  { id: "pending-documents", name: "Users with Pending Documents" },
  { id: "upcoming-appointments", name: "Users with Upcoming Appointments" }
];

// Mock templates
const notificationTemplates = [
  {
    id: "template-1",
    name: "Claim Status Update",
    content: "Your claim status has been updated to {{status}}. {{details}}"
  },
  {
    id: "template-2",
    name: "Document Request",
    content:
      "Please submit {{document_name}} within {{days}} days to continue processing your claim."
  },
  {
    id: "template-3",
    name: "Appointment Reminder",
    content: "Reminder: You have an appointment scheduled for {{date}} at {{time}} at {{location}}."
  },
  {
    id: "template-4",
    name: "System Maintenance",
    content:
      "The VA Claims system will be undergoing maintenance on {{date}} from {{start_time}} to {{end_time}}. Services will be unavailable during this time."
  }
];

export default function NotificationForm() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.SYSTEM.toString(),
      priority: Priority.MEDIUM.toString(),
      recipients: "all",
      schedulingType: "immediate"
    }
  });

  // Watch form values for conditional rendering
  const recipientType = form.watch("recipients");
  const schedulingType = form.watch("schedulingType");
  const selectedType = form.watch("type");
  const selectedPriority = form.watch("priority");

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = notificationTemplates.find((t) => t.id === templateId);
    if (template) {
      form.setValue("title", template.name);
      form.setValue("message", template.content);
      setPreviewContent(template.content);
    }
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // In a real implementation, this would send the notification to the backend
    console.log("Notification data:", data);

    // Show success toast
    toast({
      title: "Notification created",
      description:
        data.schedulingType === "immediate"
          ? "Your notification has been sent successfully."
          : "Your notification has been scheduled successfully."
    });

    // Reset form
    form.reset();
    setSelectedTemplate(null);
    setPreviewContent("");
  };

  // Generate preview content
  const generatePreview = () => {
    const title = form.getValues("title");
    const message = form.getValues("message");
    const type = form.getValues("type");
    const priority = form.getValues("priority");

    // Replace template variables with sample values
    let processedMessage = message
      .replace(/{{status}}/g, "Approved")
      .replace(/{{details}}/g, "You will receive payment details within 5-7 business days.")
      .replace(/{{document_name}}/g, "DD-214 Form")
      .replace(/{{days}}/g, "30")
      .replace(/{{date}}/g, "June 15, 2024")
      .replace(/{{time}}/g, "10:00 AM")
      .replace(/{{location}}/g, "VA Medical Center - Building 2, Room 305")
      .replace(/{{start_time}}/g, "2:00 AM")
      .replace(/{{end_time}}/g, "6:00 AM");

    setPreviewContent(processedMessage);

    return (
      <div className="bg-muted/30 space-y-2 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title || "Notification Title"}</h3>
          <div className="flex items-center gap-2">
            {getPriorityBadge(priority as Priority)}
            <div className="text-muted-foreground text-xs">
              {getTypeLabel(type as NotificationType)}
            </div>
          </div>
        </div>
        <p className="text-sm">{processedMessage || "Notification message will appear here..."}</p>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Just now
        </div>
      </div>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority: Priority | string) => {
    switch (priority) {
      case Priority.URGENT:
      case "urgent":
        return (
          <div className="bg-destructive text-destructive-foreground rounded px-1.5 py-0.5 text-xs">
            Urgent
          </div>
        );
      case Priority.HIGH:
      case "high":
        return <div className="rounded bg-amber-500 px-1.5 py-0.5 text-xs text-white">High</div>;
      case Priority.MEDIUM:
      case "medium":
        return <div className="rounded bg-blue-500 px-1.5 py-0.5 text-xs text-white">Medium</div>;
      case Priority.LOW:
      case "low":
        return (
          <div className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">Low</div>
        );
      default:
        return null;
    }
  };

  // Get type label
  const getTypeLabel = (type: NotificationType | string) => {
    const typeString = type.toString();
    return typeString
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>Create Notification</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="compose">
          <TabsList className="mb-4">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="template">Use Template</TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter notification title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter notification message"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            You can use variables like {{ status }}, {{ details }}, etc. for dynamic
                            content.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
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
                                <SelectItem value={NotificationType.SYSTEM.toString()}>
                                  System
                                </SelectItem>
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
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={Priority.LOW.toString()}>Low</SelectItem>
                                <SelectItem value={Priority.MEDIUM.toString()}>Medium</SelectItem>
                                <SelectItem value={Priority.HIGH.toString()}>High</SelectItem>
                                <SelectItem value={Priority.URGENT.toString()}>Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="recipients"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Recipients</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1">
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="all" />
                                </FormControl>
                                <FormLabel className="font-normal">All Users</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="group" />
                                </FormControl>
                                <FormLabel className="font-normal">User Group</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="specific" />
                                </FormControl>
                                <FormLabel className="font-normal">Specific Users</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {recipientType === "group" && (
                      <FormField
                        control={form.control}
                        name="recipientGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select user group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {userGroups.map((group) => (
                                  <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {recipientType === "specific" && (
                      <FormField
                        control={form.control}
                        name="recipientIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User IDs</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter user IDs separated by commas"
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter user IDs separated by commas (e.g., user-123, user-456)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="schedulingType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Scheduling</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1">
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="immediate" />
                                </FormControl>
                                <FormLabel className="font-normal">Send Immediately</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="scheduled" />
                                </FormControl>
                                <FormLabel className="font-normal">Schedule for Later</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="recurring" />
                                </FormControl>
                                <FormLabel className="font-normal">Recurring</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {schedulingType !== "immediate" && (
                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Scheduled Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}>
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-lg font-medium">Preview</h3>
                      {generatePreview()}
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Recipients Summary</h3>
                      <div className="bg-muted/30 rounded-md border p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {recipientType === "all" && "All Users"}
                            {recipientType === "group" && form.watch("recipientGroup")
                              ? userGroups.find((g) => g.id === form.watch("recipientGroup"))
                                  ?.name || "Selected Group"
                              : recipientType === "group"
                                ? "Select a group"
                                : ""}
                            {recipientType === "specific" &&
                              (form.watch("recipientIds")
                                ? `${form.watch("recipientIds")?.split(",").length || 0} Specific Users`
                                : "No users selected")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                  </Button>
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    {schedulingType === "immediate" ? "Send Notification" : "Schedule Notification"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="template">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Select a Template</h3>
                  <div className="space-y-2">
                    {notificationTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`hover:bg-muted/50 cursor-pointer rounded-md border p-3 ${
                          selectedTemplate === template.id ? "border-primary bg-muted/50" : ""
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {template.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Preview</h3>
                  {selectedTemplate ? (
                    <div className="bg-muted/30 rounded-md border p-4">
                      <h4 className="mb-2 font-medium">
                        {notificationTemplates.find((t) => t.id === selectedTemplate)?.name || ""}
                      </h4>
                      <p className="text-sm">
                        {previewContent
                          .replace(/{{status}}/g, "Approved")
                          .replace(
                            /{{details}}/g,
                            "You will receive payment details within 5-7 business days."
                          )
                          .replace(/{{document_name}}/g, "DD-214 Form")
                          .replace(/{{days}}/g, "30")
                          .replace(/{{date}}/g, "June 15, 2024")
                          .replace(/{{time}}/g, "10:00 AM")
                          .replace(/{{location}}/g, "VA Medical Center - Building 2, Room 305")
                          .replace(/{{start_time}}/g, "2:00 AM")
                          .replace(/{{end_time}}/g, "6:00 AM")}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-muted/30 text-muted-foreground rounded-md border p-4 text-center">
                      Select a template to see preview
                    </div>
                  )}

                  {selectedTemplate && (
                    <div className="mt-6">
                      <Button
                        onClick={() => {
                          form.setValue("templateId", selectedTemplate);
                          const template = notificationTemplates.find(
                            (t) => t.id === selectedTemplate
                          );
                          if (template) {
                            form.setValue("title", template.name);
                            form.setValue("message", template.content);
                          }
                        }}
                        className="w-full">
                        Use This Template
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
}
