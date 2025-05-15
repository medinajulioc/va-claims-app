"use client";

import { Condition } from "@/lib/conditions";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Icon from "@/components/icon";

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
          <Card
            className={`hover:border-primary cursor-pointer transition-all hover:shadow-md ${
              isSelected ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onSelect(condition)}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <Icon name={condition.icon} className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{condition.name}</h3>
                <p className="text-muted-foreground line-clamp-1 text-xs">
                  {condition.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{condition.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
