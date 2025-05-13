import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UpgradePlanCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
        <CardDescription className="text-2xl font-bold">4</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-xs">+2 from last month</div>
      </CardContent>
    </Card>
  );
}
