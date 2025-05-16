"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const faqItems = [
  {
    question: "How is my VA disability rating calculated?",
    answer:
      "The VA uses the 'whole person theory' to calculate combined disability ratings. This is not a simple addition of percentages. Each disability affects your remaining capacity. For example, if you have a 30% and a 20% disability, your combined rating would be 44%, which the VA rounds to 40%. Our calculator uses the official VA formula to determine your combined rating.",
    tags: ["ratings", "calculation", "formula"]
  },
  {
    question: "What is Special Monthly Compensation (SMC)?",
    answer:
      "Special Monthly Compensation (SMC) is an additional tax-free benefit for veterans with specific severe disabilities or combinations of disabilities. SMC rates range from SMC-K to SMC-S, with higher levels providing greater compensation. These benefits are paid in addition to your regular disability compensation and are designed to help with costs associated with more severe service-connected conditions.",
    tags: ["smc", "compensation", "benefits"]
  },
  {
    question: "How do dependents affect my VA disability payment?",
    answer:
      "Veterans with a disability rating of 30% or higher receive additional compensation for dependents, including spouses, children under 18, children between 18-23 in school, and dependent parents. The exact amount varies based on your disability rating and the number of dependents. Our calculator factors in these additional payments based on the information you provide about your dependents.",
    tags: ["dependents", "spouse", "children", "compensation"]
  },
  {
    question: "Are the VA disability compensation rates updated annually?",
    answer:
      "Yes, VA disability compensation rates typically increase annually through a Cost of Living Adjustment (COLA). These adjustments are based on the Consumer Price Index and help ensure that your benefits keep pace with inflation. Our calculator uses the official 2025 VA compensation rates, which include the most recent COLA increase.",
    tags: ["rates", "cola", "annual", "increase"]
  },
  {
    question: "Why might my actual VA payment differ from the calculator estimate?",
    answer:
      "While our calculator provides an accurate estimate based on the information you enter, your actual payment may differ due to factors such as retroactive adjustments, deductions for military retirement pay, VA pension offsets, garnishments, or other special circumstances. Always verify your specific payment details with the VA.",
    tags: ["payment", "estimate", "differences"]
  },
  {
    question: "How do I apply for an increase in my VA disability rating?",
    answer:
      "To request an increase in your VA disability rating, you need to file a claim for increased disability compensation (VA Form 21-526EZ). You'll need to provide medical evidence showing that your service-connected condition has worsened. This can include recent medical records, statements from healthcare providers, and personal statements about how your condition affects your daily life and ability to work.",
    tags: ["increase", "claim", "application"]
  },
  {
    question: "What is bilateral factor and how does it affect my rating?",
    answer:
      "The bilateral factor provides an additional 10% to your combined rating when you have disabilities affecting both arms, both legs, or paired skeletal muscles. This additional percentage is applied before the final combined rating is calculated. For example, if you have a 20% rating for your right knee and a 10% rating for your left knee, the bilateral factor would add an additional 3% (10% of 30%) to your combined rating before rounding.",
    tags: ["bilateral factor", "paired disabilities", "calculation"]
  },
  {
    question: "Can my VA disability rating be reduced?",
    answer:
      "Yes, the VA can propose to reduce your disability rating if they determine that your condition has improved. However, there are protections in place: ratings in effect for 5+ years require substantial improvement, ratings for 20+ years are generally protected unless there was fraud, and 100% ratings have special protections. You'll receive notice before any reduction and have the right to request a hearing and submit evidence.",
    tags: ["reduction", "protection", "hearing"]
  },
  {
    question: "How does the VA round disability percentages?",
    answer:
      "After calculating your combined disability rating using the whole person theory, the VA rounds the final percentage to the nearest 10%. For example, a calculated rating of 54% would be rounded down to 50%, while a rating of 55% would be rounded up to 60%. This rounding only applies to the final combined rating, not to individual disability percentages.",
    tags: ["rounding", "calculation", "percentages"]
  },
  {
    question: "What is a VA Individual Unemployability (TDIU) benefit?",
    answer:
      "Total Disability based on Individual Unemployability (TDIU) allows veterans to receive compensation at the 100% rate, even if their combined schedular rating is less than 100%. To qualify, you must be unable to maintain substantially gainful employment due to your service-connected disabilities and meet certain rating requirements (one disability at 60% or multiple disabilities with at least one at 40% and a combined rating of 70%).",
    tags: ["unemployability", "tdiu", "100%", "employment"]
  }
];

export default function FAQAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? faqItems.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : faqItems;

  const handleAccordionChange = (value: string) => {
    if (expandedItems.includes(value)) {
      setExpandedItems(expandedItems.filter((item) => item !== value));
    } else {
      setExpandedItems([...expandedItems, value]);
    }
  };

  const handleExpandAll = () => {
    if (expandedItems.length === filteredFAQs.length) {
      setExpandedItems([]);
    } else {
      setExpandedItems(filteredFAQs.map((_, index) => `item-${index}`));
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b pb-5">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <CardTitle className="text-primary text-xl font-semibold">
            Frequently Asked Questions
          </CardTitle>
          <button
            onClick={handleExpandAll}
            className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors">
            {expandedItems.length === filteredFAQs.length ? (
              <>
                <ChevronUp className="size-4" /> Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="size-4" /> Expand All
              </>
            )}
          </button>
        </div>
        <div className="relative mt-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search FAQs by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {filteredFAQs.length > 0 ? (
          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="w-full">
            {filteredFAQs.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b py-2 last:border-0">
                <AccordionTrigger className="py-3 text-left text-base font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-4">
                  <div className="space-y-4">
                    <p className="leading-relaxed">{item.answer}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery(tag);
                          }}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-12 text-center">
            <div className="bg-muted/30 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <Search className="text-muted-foreground size-8" />
            </div>
            <p className="text-muted-foreground text-lg">No FAQs found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 text-sm font-medium transition-colors">
              Clear Search
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
