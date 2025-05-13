import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FailedConversionsCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Expired API Keys</CardTitle>
        <CardDescription className="text-2xl font-bold">1</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-xs">25% of total keys</div>
      </CardContent>
    </Card>
  );
}
