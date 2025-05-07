"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutMe() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          I'm John Doe, a proud veteran who served in the United States Army from 2008 to 2016. I completed two deployments to Afghanistan and served as a Combat Medic (68W). Since transitioning to civilian life, I've been navigating the VA claims process and helping fellow veterans understand their benefits.
        </p>
        <p>
          My experience with the VA system has motivated me to share knowledge and resources with other veterans. I believe in making the claims process more transparent and accessible for all who served. I'm currently pursuing a degree in Healthcare Administration while advocating for improved veteran services in my community.
        </p>
      </CardContent>
    </Card>
  );
}
