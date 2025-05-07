import { generateMeta } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChartIcon,
  Filter, 
  FileText, 
  ShieldAlert, 
  UserPlus
} from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "User Management",
    description: "Manage user accounts and permissions in the admin dashboard",
    canonical: "/bdoc/users"
  });
}

// Simple stat card
function StatCard({ title, description, data, icon, className = "h-72" }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <p className="text-muted-foreground mb-2">Demo data visualization</p>
          <div className="text-center">
            {data.map((item, index) => (
              <div key={index} className="flex justify-between my-1">
                <span>{item.name}:</span>
                <span className="font-medium ml-2">
                  {typeof item.value === 'number' ? 
                    item.value.toLocaleString() : 
                    item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsersPage() {
  // Demo user data
  const users = [
    { 
      id: "U12345", 
      name: "Michael Johnson", 
      email: "mjohnson@example.com", 
      status: "active", 
      role: "Veteran", 
      lastLogin: "2 hours ago",
      avatar: "M"
    },
    { 
      id: "U12346", 
      name: "Sarah Williams", 
      email: "swilliams@example.com", 
      status: "active", 
      role: "Veteran", 
      lastLogin: "1 day ago",
      avatar: "S"
    },
    { 
      id: "U12347", 
      name: "Robert Davis", 
      email: "rdavis@example.com", 
      status: "inactive", 
      role: "Veteran", 
      lastLogin: "3 weeks ago",
      avatar: "R"
    },
    { 
      id: "U12348", 
      name: "Jennifer Miller", 
      email: "jmiller@example.com", 
      status: "active", 
      role: "Representative", 
      lastLogin: "5 hours ago",
      avatar: "J"
    },
    { 
      id: "U12349", 
      name: "David Wilson", 
      email: "dwilson@example.com", 
      status: "active", 
      role: "Admin", 
      lastLogin: "Just now",
      avatar: "D"
    },
    { 
      id: "U12350", 
      name: "Lisa Brown", 
      email: "lbrown@example.com", 
      status: "active", 
      role: "Veteran", 
      lastLogin: "3 days ago",
      avatar: "L"
    },
    { 
      id: "U12351", 
      name: "Kevin Taylor", 
      email: "ktaylor@example.com", 
      status: "inactive", 
      role: "Representative", 
      lastLogin: "2 months ago",
      avatar: "K"
    },
    { 
      id: "U12352", 
      name: "Michelle Lee", 
      email: "mlee@example.com", 
      status: "active", 
      role: "Veteran", 
      lastLogin: "12 hours ago",
      avatar: "M"
    },
  ];

  // Demo signup data
  const userSignupsData = [
    { name: "Jan", value: 84 },
    { name: "Feb", value: 112 },
    { name: "Mar", value: 153 },
    { name: "Apr", value: 132 },
    { name: "May", value: 168 },
    { name: "Jun", value: 187 },
    { name: "Jul", value: 219 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">User Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Accounts</CardTitle>
            <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
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
                <TableHead>User</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatars/${user.id}.png`} alt={user.name} />
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="sr-only">Edit Permissions</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard 
          title="New Sign-ups" 
          description="Monthly user registrations"
          data={userSignupsData}
          icon={<BarChartIcon className="h-5 w-5 text-muted-foreground" />}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Users by role and status</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium mb-2">By Role</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Veterans</span>
                    <Badge variant="outline">874</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Representatives</span>
                    <Badge variant="outline">293</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Admins</span>
                    <Badge variant="outline">80</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">By Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active</span>
                    <Badge variant="outline">1,146</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Inactive</span>
                    <Badge variant="outline">101</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 