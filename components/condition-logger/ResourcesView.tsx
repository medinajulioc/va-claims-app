"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, BookOpen, FileText, HelpCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResourcesViewProps {
  condition?: string;
}

export function ResourcesView({ condition = "Headaches" }: ResourcesViewProps) {
  const [activeTab, setActiveTab] = useState("va-guidelines");

  // Only show migraine resources for Headaches condition
  if (condition !== "Headaches") {
    return (
      <Card className="bg-card border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium">
            <BookOpen className="mr-2 h-5 w-5" />
            Resources for {condition}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-6 text-center">
            Resources specific to {condition} are not available yet. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <BookOpen className="mr-2 h-5 w-5" />
          Migraine Resources for Veterans
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 grid w-full grid-cols-3 p-1">
            <TabsTrigger
              value="va-guidelines"
              className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
              <FileText className="mr-2 h-4 w-4" />
              VA Guidelines
            </TabsTrigger>
            <TabsTrigger
              value="claim-tips"
              className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Claim Tips
            </TabsTrigger>
            <TabsTrigger
              value="management"
              className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Management
            </TabsTrigger>
          </TabsList>

          {/* VA Guidelines */}
          <TabsContent value="va-guidelines" className="mt-4 space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Why Tracking Matters</AlertTitle>
              <AlertDescription className="text-sm text-blue-700">
                Consistent, detailed headache tracking is one of the most powerful tools for
                supporting your VA disability claim. The data you log here directly addresses the
                VA's rating criteria.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">VA Rating Criteria for Migraines</h3>
              <p className="text-muted-foreground text-sm">
                Migraines are evaluated under 38 CFR 4.124a, Diagnostic Code 8100, with ratings from
                0% to 50% based on frequency and severity of prostrating attacks.
              </p>

              <div className="bg-muted/50 mt-4 rounded-lg p-3">
                <h4 className="mb-2 text-sm font-medium">Rating Schedule</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="font-medium">0%</span>
                    <span>With less frequent attacks</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">10%</span>
                    <span>
                      With characteristic prostrating attacks averaging one in 2 months over last
                      several months
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">30%</span>
                    <span>
                      With characteristic prostrating attacks occurring on an average once a month
                      over last several months
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">50%</span>
                    <span>
                      With very frequent completely prostrating and prolonged attacks productive of
                      severe economic inadaptability
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 space-y-4">
                <div className="bg-muted/30 border-primary rounded-lg border-l-4 p-3">
                  <h4 className="text-primary mb-2 text-sm font-medium">
                    What is a "Prostrating" Attack?
                  </h4>
                  <p className="text-sm">
                    While the VA doesn't explicitly define "prostrating" in its regulations, VA
                    decisions and medical opinions generally consider a prostrating attack to be one
                    that:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>Forces you to stop all activity and lie down</li>
                    <li>Requires you to seek a dark, quiet environment</li>
                    <li>Makes you unable to work or function normally</li>
                    <li>
                      Causes symptoms severe enough that continuing activity would worsen your
                      condition
                    </li>
                    <li>Typically lasts for hours rather than minutes</li>
                  </ul>
                  <p className="mt-2 text-sm italic">
                    <strong>Documentation Tip:</strong> When logging headaches, be specific about
                    how they affected your ability to function and what actions you had to take
                    (e.g., "Had to leave work early and lie down in dark room for 4 hours").
                  </p>

                  <div className="bg-muted mt-3 rounded p-2 text-xs">
                    <p>
                      <strong>Case Law Reference:</strong> In Pierce v. Principi (2001), the Court
                      held that "prostrating" means "to reduce to submission, subdue, or overcome"
                      and refers to a headache that causes the veteran to be "powerless" or
                      "helpless" during the attack.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 border-primary rounded-lg border-l-4 p-3">
                  <h4 className="text-primary mb-2 text-sm font-medium">
                    Understanding "Economic Inadaptability"
                  </h4>
                  <p className="text-sm">
                    For the 50% rating, the VA requires "severe economic inadaptability," which does
                    NOT mean you must be completely unable to work. According to case law (Pierce v.
                    Principi, 2006):
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>You don't need to prove you're unemployable due to migraines</li>
                    <li>Economic inadaptability can mean significant work disruption</li>
                    <li>Missing work frequently, leaving early, or reduced productivity counts</li>
                    <li>
                      Accommodations needed at work (flexible schedule, dark room) are relevant
                    </li>
                    <li>Impact on promotion potential or job choices is considered</li>
                  </ul>
                  <p className="mt-2 text-sm italic">
                    <strong>Documentation Tip:</strong> Track work absences, reduced hours, and
                    accommodations needed due to migraines.
                  </p>

                  <div className="bg-muted mt-3 rounded p-2 text-xs">
                    <p>
                      <strong>BVA Decision Reference:</strong> Multiple Board of Veterans Appeals
                      decisions have confirmed that "severe economic inadaptability" does not
                      require the veteran to be completely unable to work. Instead, it refers to a
                      significant impact on your ability to maintain consistent employment or
                      perform at your full capacity.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 border-primary rounded-lg border-l-4 p-3">
                  <h4 className="text-primary mb-2 text-sm font-medium">
                    How the VA Calculates Frequency
                  </h4>
                  <p className="text-sm">
                    The VA evaluates frequency based on a pattern established "over the last several
                    months":
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>
                      <strong>10% rating:</strong> Requires evidence of prostrating attacks
                      averaging one every 2 months (about 6 per year)
                    </li>
                    <li>
                      <strong>30% rating:</strong> Requires evidence of prostrating attacks
                      averaging once per month (about 12 per year)
                    </li>
                    <li>
                      <strong>50% rating:</strong> "Very frequent" is not precisely defined but
                      typically means multiple prostrating attacks per month
                    </li>
                    <li>The VA typically looks at a 6-12 month period to establish patterns</li>
                    <li>Consistent logging is critical to establish these patterns</li>
                  </ul>
                  <p className="mt-2 text-sm italic">
                    <strong>Documentation Tip:</strong> This app helps you track frequency patterns
                    that match VA rating criteria. Aim for at least 6 months of consistent logging.
                  </p>

                  <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-2">
                    <p className="text-xs font-medium text-amber-800">
                      Important Note on "Several Months"
                    </p>
                    <p className="text-xs text-amber-700">
                      The VA typically requires at least 3-6 months of consistent headache
                      documentation to establish a pattern. For the most compelling evidence, aim to
                      log your headaches consistently for at least 6 months before your C&P exam.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 border-primary rounded-lg border-l-4 p-3">
                  <h4 className="text-primary mb-2 text-sm font-medium">
                    Key Factors the VA Considers
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>
                      <strong>Severity:</strong> Higher severity (7-10 on pain scale) helps
                      establish the "prostrating" nature
                    </li>
                    <li>
                      <strong>Duration:</strong> Longer attacks (several hours) support higher
                      ratings
                    </li>
                    <li>
                      <strong>Associated symptoms:</strong> Nausea, vomiting, and sensory
                      sensitivities help document severity
                    </li>
                    <li>
                      <strong>Treatment response:</strong> Poor response to medication supports
                      higher ratings
                    </li>
                    <li>
                      <strong>Impact on activities:</strong> Detailed documentation of how headaches
                      affect daily life and work
                    </li>
                  </ul>
                  <p className="mt-2 text-sm italic">
                    <strong>Documentation Tip:</strong> Use the "Notes" field to describe specific
                    examples of how each headache affected your ability to function.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Official VA Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-B/subject-group-ECFRab3ca55f4548afe/section-4.124a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-500 hover:underline">
                      38 CFR 4.124a - Schedule of ratings for neurological conditions
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.benefits.va.gov/compensation/docs/Headaches.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-500 hover:underline">
                      Headaches Disability Benefits Questionnaire (DBQ)
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.va.gov/disability/eligibility/illnesses-within-one-year-of-discharge/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-500 hover:underline">
                      VA Presumptive Conditions
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Claim Tips */}
          <TabsContent value="claim-tips" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Understanding "Prostrating" Attacks</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  The VA doesn't specifically define "prostrating," but it generally refers to
                  attacks that force you to stop activities and seek rest. Document when migraines:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>Force you to lie down in a dark, quiet room</li>
                  <li>Prevent you from working or performing daily activities</li>
                  <li>Require you to take sick leave or miss appointments</li>
                  <li>Need medication that causes significant side effects</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium">Documentation Tips</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>Be consistent with your logging - regular entries show patterns</li>
                  <li>
                    Include specific details about how migraines affect your work and daily life
                  </li>
                  <li>Note any accommodations you need during attacks</li>
                  <li>Document all medications, their effectiveness, and side effects</li>
                  <li>Export reports from this app to share with your healthcare providers</li>
                  <li>Ask your doctor to complete a DBQ specifically for migraines</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium">Service Connection Tips</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  To establish service connection for migraines, consider these approaches:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>
                    <span className="font-medium">Direct Service Connection:</span> Show migraines
                    began during service
                  </li>
                  <li>
                    <span className="font-medium">Secondary Connection:</span> Link to
                    service-connected conditions like TBI, PTSD, or neck injuries
                  </li>
                  <li>
                    <span className="font-medium">Presumptive Connection:</span> If diagnosed within
                    one year of discharge
                  </li>
                  <li>
                    <span className="font-medium">Aggravation:</span> Show pre-existing migraines
                    worsened during service
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Management */}
          <TabsContent value="management" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Veteran-Specific Triggers to Avoid</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>
                    <span className="font-medium">Loud Noises:</span> Wear noise-canceling
                    headphones in triggering environments
                  </li>
                  <li>
                    <span className="font-medium">Bright Lights:</span> Use FL-41 tinted glasses,
                    which can help with light sensitivity
                  </li>
                  <li>
                    <span className="font-medium">Stress:</span> Practice stress management
                    techniques from VA mindfulness programs
                  </li>
                  <li>
                    <span className="font-medium">Sleep Disruption:</span> Maintain a consistent
                    sleep schedule, even on weekends
                  </li>
                  <li>
                    <span className="font-medium">Combat Reminders:</span> Work with a VA therapist
                    on coping strategies
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium">VA Treatment Resources</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>Ask your VA primary care provider for a neurology referral</li>
                  <li>VA Headache Centers of Excellence are available at select facilities</li>
                  <li>Consider VA Whole Health approaches like acupuncture and meditation</li>
                  <li>Ask about the VA's CGRP inhibitor treatments for chronic migraines</li>
                  <li>Explore VA telehealth options for ongoing headache management</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium">Self-Management Strategies</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>Create a "migraine kit" with medications, eye mask, earplugs, and water</li>
                  <li>Identify and track your personal triggers using this app</li>
                  <li>
                    Practice the 4-7-8 breathing technique during onset (inhale for 4, hold for 7,
                    exhale for 8)
                  </li>
                  <li>Apply cold packs to the forehead or back of the neck</li>
                  <li>Stay hydrated and maintain regular meals to prevent triggers</li>
                </ul>
              </div>

              <div className="bg-muted/50 mt-2 rounded-lg p-3">
                <h4 className="mb-1 text-sm font-medium">Veterans Crisis Resources</h4>
                <p className="text-muted-foreground text-xs">
                  If you're experiencing severe symptoms or having thoughts of self-harm due to
                  chronic pain:
                </p>
                <p className="mt-2 text-sm font-medium">
                  Call the Veterans Crisis Line: 988, then press 1
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
