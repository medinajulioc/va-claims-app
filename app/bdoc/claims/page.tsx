import { generateMeta } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "Claims Administration",
    description: "Manage and process veteran benefit claims",
    canonical: "/bdoc/claims"
  });
}

export default function ClaimsPage() {
  // Demo claims data
  const claims = [
    {
      id: "C78901",
      claimant: "Michael Johnson",
      type: "Disability Increase",
      status: "pending",
      submitted: "Jul 15, 2023",
      documents: 8
    },
    {
      id: "C78902",
      claimant: "Sarah Williams",
      type: "New Condition",
      status: "approved",
      submitted: "Jul 10, 2023",
      documents: 12
    },
    {
      id: "C78903",
      claimant: "Robert Davis",
      type: "Appeal",
      status: "rejected",
      submitted: "Jul 8, 2023",
      documents: 6
    },
    {
      id: "C78904",
      claimant: "Jennifer Miller",
      type: "Disability Increase",
      status: "processing",
      submitted: "Jul 5, 2023",
      documents: 9
    },
    {
      id: "C78905",
      claimant: "David Thompson",
      type: "New Condition",
      status: "pending",
      submitted: "Jul 18, 2023",
      documents: 5
    },
    {
      id: "C78906",
      claimant: "Jessica Martinez",
      type: "Appeal",
      status: "pending",
      submitted: "Jul 17, 2023",
      documents: 10
    },
    {
      id: "C78907",
      claimant: "Kevin Anderson",
      type: "Disability Increase",
      status: "approved",
      submitted: "Jul 3, 2023",
      documents: 7
    },
    {
      id: "C78908",
      claimant: "Amanda Wilson",
      type: "New Condition",
      status: "processing",
      submitted: "Jul 1, 2023",
      documents: 11
    },
    {
      id: "C78909",
      claimant: "Christopher Lewis",
      type: "Appeal",
      status: "rejected",
      submitted: "Jun 28, 2023",
      documents: 9
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Claims Administration</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          <span>New Claim</span>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Claims Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-muted-foreground mt-1">
              Oldest: 15 days ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Claims Approved (This Month)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 11.3%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Claims Rejected (This Month)</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-rose-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-1" /> 3.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Claims List</CardTitle>
            <p className="text-sm text-muted-foreground">Manage and process veteran benefit claims</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Claimant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>{claim.claimant}</TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>
                    <Badge variant={
                      claim.status === "approved" ? "default" : 
                      claim.status === "rejected" ? "destructive" : 
                      claim.status === "processing" ? "outline" : "secondary"
                    }>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.submitted}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{claim.documents}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      {claim.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500">
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Claims Processing Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">Average time to process claims by type</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">New Condition</span>
                <span className="text-sm text-muted-foreground">42 days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Disability Increase</span>
                <span className="text-sm text-muted-foreground">36 days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Appeals</span>
                <span className="text-sm text-muted-foreground">68 days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 