"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Condition, ConditionField } from "@/lib/conditions";
import { templates } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  HelpCircle,
  Mic,
  MicOff,
  Flame,
  ThermometerSnowflake,
  Thermometer,
  InfoIcon,
  AlertCircle,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DynamicFormProps {
  conditions: Condition[];
  selectedCondition: string | null;
  onConditionChange: (condition: string | null) => void;
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  templates?: Record<string, Record<string, any>>;
}

// Fields that are critical for VA ratings
const criticalVAFields = ["prostrating", "severity", "duration", "impact", "symptoms", "triggers"];

// Group fields by category for better organization
const fieldGroups = {
  essential: ["date", "time", "severity", "duration", "prostrating"],
  symptoms: ["painLocation", "symptoms"],
  treatment: ["medications", "medEffectiveness"],
  context: ["triggers", "impact", "sleepQuality", "weather"],
  notes: ["notes"]
};

// Memoized help button to prevent re-renders
const HelpButton = memo(
  ({
    label,
    tooltip,
    fieldName,
    isHeadache,
    isCritical,
    isRequired
  }: {
    label: string;
    tooltip?: string;
    fieldName: string;
    isHeadache: boolean;
    isCritical: boolean;
    isRequired: boolean;
  }) => {
    const fieldId = `field-${fieldName}`;
    const descriptionId = `${fieldId}-description`;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              aria-label={`Help for ${label}`}
              type="button">
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[350px] space-y-2 p-3">
            {tooltip ? (
              <>
                <p id={descriptionId} className="text-sm">
                  {tooltip}
                </p>
                {isHeadache && isCritical && (
                  <div className="mt-2 rounded-sm bg-amber-50 p-2 dark:bg-amber-950">
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                      <AlertCircle className="mr-1 inline h-3 w-3" />
                      Critical for VA rating determination
                    </p>
                    {fieldName === "prostrating" && (
                      <p className="text-xs">
                        Marking headaches as prostrating is required for 10%, 30%, and 50% VA
                        disability ratings.
                      </p>
                    )}
                    {fieldName === "triggers" && (
                      <p className="text-xs">
                        Service-related triggers are crucial for establishing service connection for
                        your headache condition.
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p id={descriptionId}>
                {label} is {isRequired ? "required" : "optional"}.
              </p>
            )}
            {tooltip && tooltip.includes("placeholder") && (
              <p className="text-muted-foreground mt-1 text-xs">{tooltip}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

HelpButton.displayName = "HelpButton";

export const DynamicForm = ({
  conditions,
  selectedCondition,
  onConditionChange,
  onSubmit,
  initialValues = {},
  templates = {}
}: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Find the selected condition object
  const condition = selectedCondition ? conditions.find((c) => c.id === selectedCondition) : null;

  // Initialize form with default values (date field defaults to today)
  useEffect(() => {
    if (!condition) return;

    const initialData: Record<string, any> = { ...initialValues };
    condition.fields.forEach((field) => {
      if (!(field.name in initialData)) {
        if (field.name === "date") {
          initialData[field.name] = new Date().toISOString().split("T")[0];
        } else {
          initialData[field.name] = "";
        }
      }
    });
    setFormData(initialData);
  }, [condition, initialValues]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Define SpeechRecognition with proper type handling
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          setVoiceText(transcript);
          parseVoiceCommand(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast.error("Voice recognition error: " + event.error);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.info("Voice input activated. Speak clearly to log your symptoms.");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Could not start voice recognition. Please try again.");
      }
    }
  };

  const parseVoiceCommand = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();

    // Parse severity
    const severityMatch = lowerTranscript.match(/severity (\d+)/);
    if (severityMatch && severityMatch[1]) {
      const severity = parseInt(severityMatch[1]);
      if (severity >= 1 && severity <= 10) {
        handleChange("severity", severity);
        toast.success(`Set severity to ${severity}`);
      }
    }

    // Parse duration
    const durationMatch = lowerTranscript.match(/duration (\d+)/);
    if (durationMatch && durationMatch[1]) {
      const duration = parseInt(durationMatch[1]);
      if (duration > 0) {
        handleChange("duration", duration);
        toast.success(`Set duration to ${duration} hours`);
      }
    }

    // Parse prostrating
    if (
      lowerTranscript.includes("prostrating yes") ||
      lowerTranscript.includes("prostrating true")
    ) {
      handleChange("prostrating", "Yes");
      toast.success("Set prostrating to Yes");
    } else if (
      lowerTranscript.includes("prostrating no") ||
      lowerTranscript.includes("prostrating false")
    ) {
      handleChange("prostrating", "No");
      toast.success("Set prostrating to No");
    }

    // Parse template shortcuts
    if (lowerTranscript.includes("mild") || lowerTranscript.includes("minor")) {
      handleQuickLog("mild");
      toast.success("Applied mild template");
    } else if (lowerTranscript.includes("moderate") || lowerTranscript.includes("medium")) {
      handleQuickLog("moderate");
      toast.success("Applied moderate template");
    } else if (lowerTranscript.includes("severe") || lowerTranscript.includes("bad")) {
      handleQuickLog("severe");
      toast.success("Applied severe template");
    } else if (lowerTranscript.includes("prostrating attack")) {
      handleQuickLog("prostrating");
      toast.success("Applied prostrating attack template");
    }

    // Parse submit command
    if (lowerTranscript.includes("submit") || lowerTranscript.includes("save log")) {
      onSubmit(formData);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleQuickLog = (templateType: string) => {
    if (!condition) return;

    const conditionName = condition.name as keyof typeof templates;
    if (templates[conditionName] && templates[conditionName][templateType]) {
      const templateData = templates[conditionName][templateType];
      setFormData((prev) => ({ ...prev, ...templateData }));
      setActiveTemplate(templateType);
    }
  };

  // Group condition fields by category
  const getFieldsByGroup = (groupName: string) => {
    if (!condition) return [];
    const groupFieldNames = fieldGroups[groupName as keyof typeof fieldGroups] || [];
    return condition.fields.filter((field) => groupFieldNames.includes(field.name));
  };

  const renderField = (field: ConditionField) => {
    const fieldId = `field-${field.name}`;
    const descriptionId = `${fieldId}-description`;
    const isCritical = criticalVAFields.includes(field.name);

    switch (field.type) {
      case "text":
        return (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Input
              id={fieldId}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={`focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2 ${
                isCritical ? "border-amber-300" : ""
              }`}
              aria-describedby={descriptionId}
              aria-required={field.required}
            />
          </motion.div>
        );
      case "number":
        return (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Input
              id={fieldId}
              name={field.name}
              type="number"
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, parseInt(e.target.value, 10) || "")}
              min={field.min}
              max={field.max}
              required={field.required}
              className={`focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2 ${
                isCritical ? "border-amber-300" : ""
              }`}
              aria-describedby={descriptionId}
              aria-required={field.required}
              aria-valuemin={field.min}
              aria-valuemax={field.max}
            />
          </motion.div>
        );
      case "date":
        return (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Input
              id={fieldId}
              name={field.name}
              type="date"
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className={`focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2 ${
                isCritical ? "border-amber-300" : ""
              }`}
              aria-describedby={descriptionId}
              aria-required={field.required}
            />
          </motion.div>
        );
      case "time":
        return (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Input
              id={fieldId}
              name={field.name}
              type="time"
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className={`focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2 ${
                isCritical ? "border-amber-300" : ""
              }`}
              aria-describedby={descriptionId}
              aria-required={field.required}
            />
          </motion.div>
        );
      case "select":
        return (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => {
                if (value !== formData[field.name]) {
                  handleChange(field.name, value);
                }
              }}
              name={field.name}>
              <SelectTrigger
                className={`focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2 ${
                  isCritical ? "border-amber-300" : ""
                }`}
                id={fieldId}
                aria-describedby={descriptionId}
                aria-required={field.required}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        );
      case "textarea":
        return (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Textarea
              id={fieldId}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={`focus:ring-primary/20 min-h-[100px] w-full transition-all duration-200 focus:ring-2 ${
                isCritical ? "border-amber-300" : ""
              }`}
              aria-describedby={descriptionId}
              aria-required={field.required}
            />
          </motion.div>
        );
      case "checkbox":
        return (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2">
            {field.options?.map((option) => {
              const isChecked = Array.isArray(formData[field.name])
                ? formData[field.name]?.includes(option)
                : false;
              return (
                <Button
                  key={option}
                  type="button"
                  variant={isChecked ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const currentValues = Array.isArray(formData[field.name])
                      ? [...formData[field.name]]
                      : [];
                    const newValues = isChecked
                      ? currentValues.filter((v) => v !== option)
                      : [...currentValues, option];
                    handleChange(field.name, newValues);
                  }}
                  className={`transition-all duration-200 ${
                    isChecked ? "" : "hover:bg-primary/5"
                  } ${isCritical ? (isChecked ? "" : "border-amber-300") : ""}`}>
                  {option}
                </Button>
              );
            })}
          </motion.div>
        );
      default:
        return null;
    }
  };

  const renderFieldGroup = (groupName: string, title: string, icon: React.ReactNode) => {
    if (!condition) return null;
    const fields = getFieldsByGroup(groupName);
    if (!fields.length) return null;

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <motion.div
                key={field.name}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-1.5">
                  <Label htmlFor={`field-${field.name}`} className="text-sm font-medium">
                    {field.label}
                    {condition.name === "Headaches" && criticalVAFields.includes(field.name) && (
                      <Badge className="ml-2 bg-amber-500" variant="secondary">
                        VA Rating
                      </Badge>
                    )}
                  </Label>
                  {field.required && (
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  )}
                  <HelpButton
                    label={field.label}
                    tooltip={field.tooltip}
                    fieldName={field.name}
                    isHeadache={condition.name === "Headaches"}
                    isCritical={criticalVAFields.includes(field.name)}
                    isRequired={field.required}
                  />
                </div>
                {renderField(field)}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      {/* Condition Selection */}
      {!condition && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <InfoIcon className="h-4 w-4" />
              Select Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCondition || ""}
              onValueChange={(value) => {
                if (value !== selectedCondition) {
                  onConditionChange(value || null);
                }
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a condition to log" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {condition && (
        <>
          {/* Quick Templates */}
          <Card className="bg-muted/20 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Log Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={activeTemplate === "mild" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickLog("mild")}
                  className="transition-all duration-200">
                  Mild Headache
                </Button>
                <Button
                  type="button"
                  variant={activeTemplate === "moderate" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickLog("moderate")}
                  className="transition-all duration-200">
                  Moderate Headache
                </Button>
                <Button
                  type="button"
                  variant={activeTemplate === "severe" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickLog("severe")}
                  className="transition-all duration-200">
                  Severe Headache
                </Button>
                <Button
                  type="button"
                  variant={activeTemplate === "prostrating" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickLog("prostrating")}
                  className="transition-all duration-200">
                  Prostrating Attack
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Voice Input */}
          <Card className={`border ${isListening ? "border-primary bg-primary/5" : "bg-muted/20"}`}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                {isListening ? (
                  <Mic className="text-primary h-5 w-5 animate-pulse" />
                ) : (
                  <MicOff className="text-muted-foreground h-5 w-5" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {isListening ? "Voice Input Active" : "Voice Input"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {isListening
                      ? "Speak clearly: 'severity 8', 'prostrating yes', or 'apply severe template'"
                      : "Use voice commands to log symptoms hands-free"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant={isListening ? "default" : "outline"}
                size="sm"
                onClick={toggleListening}
                className="transition-all duration-200">
                {isListening ? "Stop" : "Start"} Voice Input
              </Button>
            </CardContent>
            {isListening && voiceText && (
              <div className="bg-muted/10 border-t px-4 py-2">
                <p className="text-muted-foreground text-xs">Heard: "{voiceText}"</p>
              </div>
            )}
          </Card>

          {/* Field Groups */}
          {renderFieldGroup("essential", "Essential Information", <InfoIcon className="h-4 w-4" />)}
          {renderFieldGroup("symptoms", "Symptoms & Location", <Thermometer className="h-4 w-4" />)}
          {renderFieldGroup("treatment", "Treatment & Medication", <Flame className="h-4 w-4" />)}
          {renderFieldGroup(
            "context",
            "Triggers & Context",
            <ThermometerSnowflake className="h-4 w-4" />
          )}
          {renderFieldGroup("notes", "Additional Notes", <HelpCircle className="h-4 w-4" />)}
        </>
      )}

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="transition-all duration-300" disabled={!condition}>
            Save Log
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
};
