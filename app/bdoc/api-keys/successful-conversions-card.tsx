import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuccessfulConversionsCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
        <CardDescription className="text-2xl font-bold">2</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-xs">50% of total keys</div>
      </CardContent>
    </Card>
  );
}
