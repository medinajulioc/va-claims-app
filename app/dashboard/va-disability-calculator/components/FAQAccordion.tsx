"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    question: "How is my VA disability rating calculated?",
    answer:
      "The VA uses the 'whole person theory' to calculate combined disability ratings. This is not a simple addition of percentages. Each disability affects your remaining capacity. For example, if you have a 30% and a 20% disability, your combined rating would be 44%, which the VA rounds to 40%. Our calculator uses the official VA formula to determine your combined rating."
  },
  {
    question: "What is Special Monthly Compensation (SMC)?",
    answer:
      "Special Monthly Compensation (SMC) is an additional tax-free benefit for veterans with specific severe disabilities or combinations of disabilities. SMC rates range from SMC-K to SMC-S, with higher levels providing greater compensation. These benefits are paid in addition to your regular disability compensation and are designed to help with costs associated with more severe service-connected conditions."
  },
  {
    question: "How do dependents affect my VA disability payment?",
    answer:
      "Veterans with a disability rating of 30% or higher receive additional compensation for dependents, including spouses, children under 18, children between 18-23 in school, and dependent parents. The exact amount varies based on your disability rating and the number of dependents. Our calculator factors in these additional payments based on the information you provide about your dependents."
  },
  {
    question: "Are the VA disability compensation rates updated annually?",
    answer:
      "Yes, VA disability compensation rates typically increase annually through a Cost of Living Adjustment (COLA). These adjustments are based on the Consumer Price Index and help ensure that your benefits keep pace with inflation. Our calculator uses the official 2025 VA compensation rates, which include the most recent COLA increase."
  },
  {
    question: "Why might my actual VA payment differ from the calculator estimate?",
    answer:
      "While our calculator provides an accurate estimate based on the information you enter, your actual payment may differ due to factors such as retroactive adjustments, deductions for military retirement pay, VA pension offsets, garnishments, or other special circumstances. Always verify your specific payment details with the VA."
  },
  {
    question: "How do I apply for an increase in my VA disability rating?",
    answer:
      "To request an increase in your VA disability rating, you need to file a claim for increased disability compensation (VA Form 21-526EZ). You'll need to provide medical evidence showing that your service-connected condition has worsened. This can include recent medical records, statements from healthcare providers, and personal statements about how your condition affects your daily life and ability to work."
  }
];

export default function FAQAccordion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Frequently Asked Questions About VA Disability Compensation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
