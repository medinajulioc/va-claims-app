"use client";

import { Condition } from "@/lib/conditions";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Icon from "@/components/icon";
import { motion } from "framer-motion";

interface ConditionCardProps {
  condition: Condition;
  onSelect: (condition: Condition) => void;
  isSelected?: boolean;
}

export const ConditionCard = ({ condition, onSelect, isSelected = false }: ConditionCardProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Card
              className={`hover:border-primary cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md ${
                isSelected ? "border-primary bg-primary/5 shadow-md" : ""
              }`}
              onClick={() => onSelect(condition)}>
              <CardContent className="flex items-center gap-3 p-4">
                <motion.div
                  className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full"
                  whileHover={{ backgroundColor: "var(--primary-15)" }}
                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}>
                  <Icon name={condition.icon} className="size-5" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-medium tracking-tight">{condition.name}</h3>
                  <p className="text-muted-foreground line-clamp-1 text-xs">
                    {condition.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px] text-sm">
          <p>{condition.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
