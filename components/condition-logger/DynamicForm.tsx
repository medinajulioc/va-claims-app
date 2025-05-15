"use client";

import { useState, useEffect, useRef } from "react";
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
import { HelpCircle, Mic, MicOff, Flame, ThermometerSnowflake, Thermometer } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DynamicFormProps {
  condition: Condition;
  onSubmit: (data: Record<string, any>) => void;
}

export const DynamicForm = ({ condition, onSubmit }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const recognitionRef = useRef<any>(null);

  // Initialize form with default values (date field defaults to today)
  useEffect(() => {
    const initialData: Record<string, any> = {};
    condition.fields.forEach((field) => {
      if (field.name === "date") {
        initialData[field.name] = new Date().toISOString().split("T")[0];
      } else {
        initialData[field.name] = "";
      }
    });
    setFormData(initialData);
  }, [condition]);

  // Initialize speech recognition
  useEffect(() => {
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setVoiceText("");
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening for voice input...");
    }
  };

  const parseVoiceCommand = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();

    // Parse severity
    const severityMatch = lowerTranscript.match(/severity (\d+)/);
    if (severityMatch && severityMatch[1]) {
      const severity = parseInt(severityMatch[1], 10);
      if (severity >= 1 && severity <= 10) {
        setFormData((prev) => ({ ...prev, severity }));
      }
    }

    // Parse date (today, yesterday)
    if (lowerTranscript.includes("today")) {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, date: today }));
    } else if (lowerTranscript.includes("yesterday")) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setFormData((prev) => ({ ...prev, date: yesterday.toISOString().split("T")[0] }));
    }

    // Parse notes
    const notesMatch = lowerTranscript.match(/notes? (.+)/);
    if (notesMatch && notesMatch[1]) {
      setFormData((prev) => ({ ...prev, notes: notesMatch[1] }));
    }

    // Parse duration
    const durationMatch = lowerTranscript.match(/duration (.+?)(hour|minute|day|week|month)s?/);
    if (durationMatch) {
      setFormData((prev) => ({ ...prev, duration: durationMatch[0].replace("duration ", "") }));
    }

    // Parse templates
    if (lowerTranscript.includes("mild")) {
      handleQuickLog("mild");
    } else if (lowerTranscript.includes("moderate")) {
      handleQuickLog("moderate");
    } else if (lowerTranscript.includes("severe")) {
      handleQuickLog("severe");
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
    if (templates[condition.name] && templates[condition.name][templateType]) {
      const templateData = templates[condition.name][templateType];
      setFormData((prev) => ({ ...prev, ...templateData }));
    }
  };

  const renderField = (field: ConditionField) => {
    const fieldId = `field-${field.name}`;
    const descriptionId = `${fieldId}-description`;

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
              className="focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2"
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
              className="focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2"
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
              className="focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2"
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
              onValueChange={(value) => handleChange(field.name, value)}
              name={field.name}>
              <SelectTrigger
                className="focus:ring-primary/20 w-full transition-all duration-200 focus:ring-2"
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
              className="focus:ring-primary/20 min-h-[100px] w-full transition-all duration-200 focus:ring-2"
              aria-describedby={descriptionId}
              aria-required={field.required}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}>
      {/* Quick log buttons */}
      <div className="flex flex-wrap gap-2">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickLog("mild")}
            className="hover:bg-primary/5 transition-all duration-300">
            <ThermometerSnowflake className="mr-2 h-4 w-4 text-blue-500" />
            Mild {condition.name}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickLog("moderate")}
            className="hover:bg-primary/5 transition-all duration-300">
            <Thermometer className="mr-2 h-4 w-4 text-amber-500" />
            Moderate {condition.name}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickLog("severe")}
            className="hover:bg-primary/5 transition-all duration-300">
            <Flame className="mr-2 h-4 w-4 text-red-500" />
            Severe {condition.name}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="ml-auto">
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={toggleListening}
            className={`transition-all duration-300 ${isListening ? "" : "hover:bg-primary/5"}`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}>
            {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isListening ? "Stop Voice" : "Voice Input"}
          </Button>
        </motion.div>
      </div>

      {/* Voice transcript display */}
      <AnimatePresence>
        {voiceText && (
          <motion.div
            className="bg-muted rounded-md p-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            <p className="text-muted-foreground text-sm">
              <span className="font-medium">Voice input:</span> {voiceText}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Try saying: "severity 7", "notes feeling pain in lower back", "duration 3 hours", or
              "mild/moderate/severe"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic form fields */}
      <div className="grid gap-6 md:grid-cols-2">
        {condition.fields.map((field, index) => (
          <motion.div
            key={field.name}
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}>
            <div className="flex items-center gap-1.5">
              <Label htmlFor={`field-${field.name}`} className="text-sm font-medium">
                {field.label}
              </Label>
              {field.required && (
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      aria-label={`Help for ${field.label}`}>
                      <HelpCircle className="text-muted-foreground h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[250px] text-sm">
                    <p id={`field-${field.name}-description`}>
                      {field.required
                        ? `${field.label} is required.`
                        : `${field.label} is optional.`}
                    </p>
                    {field.placeholder && <p>{field.placeholder}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {renderField(field)}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="transition-all duration-300">
            Save Log
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
};
