"use client";
import { generateMeta } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChartIcon,
  Filter,
  FileText,
  ShieldAlert,
  UserPlus,
  Download,
  MailPlus,
  Lock,
  UserCheck,
  UserX,
  RefreshCw,
  MoreVertical,
  X
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface StatCardProps {
  title: string;
  description: string;
  data: { name: string; value: number | string }[];
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ title, description, data, icon, className = "h-72" }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <p className="text-muted-foreground mb-2">Demo data visualization</p>
          <div className="text-center">
            {data.map((item: { name: string; value: number | string }, index: number) => (
              <div key={index} className="my-1 flex justify-between">
                <span>{item.name}:</span>
                <span className="ml-2 font-medium">
                  {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserDetailSheet({
  user,
  open,
  onOpenChange
}: {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!user) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar className="mb-2 h-20 w-20">
            <AvatarImage src={`/avatars/${user.id}.png`} alt={user.name} />
            <AvatarFallback>{user.avatar}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-muted-foreground mb-2 text-sm">{user.email}</div>
          <div className="mb-2 flex flex-wrap gap-1">
            {user.roles.map((role: string) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))}
          </div>
          <Badge variant={user.status === "active" ? "default" : "secondary"} className="mb-2">
            {user.status === "active" ? "Active" : "Inactive"}
          </Badge>
          <div className="text-muted-foreground mb-4 text-xs">Last Login: {user.lastLogin}</div>
        </div>
        <div className="px-4">
          <div className="mb-2 font-semibold">Activity History</div>
          <div className="space-y-2">
            {(user.activity || []).length === 0 && (
              <div className="text-muted-foreground text-xs">No activity recorded.</div>
            )}
            {(user.activity || []).map((act: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {act.type === "login" && <UserCheck className="h-4 w-4 text-green-500" />}
                {act.type === "password_change" && <Lock className="h-4 w-4 text-blue-500" />}
                <span>{act.type === "login" ? "Login" : "Password Change"}</span>
                <span className="text-muted-foreground ml-auto">{act.date}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t p-4">
          {/* Mock action buttons */}
          <Button variant="outline" size="sm" className="mb-1 w-full">
            Assign Roles
          </Button>
          <Button variant="outline" size="sm" className="mb-1 w-full">
            Reset Password
          </Button>
          <Button
            variant={user.status === "active" ? "destructive" : "default"}
            size="sm"
            className="w-full">
            {user.status === "active" ? "Suspend Account" : "Activate Account"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Role Assignment Modal
function RoleAssignmentModal({
  open,
  onOpenChange,
  roles,
  selectedRoles,
  onChangeRoles,
  onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: string[];
  selectedRoles: string[];
  onChangeRoles: (role: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Roles</DialogTitle>
          <DialogDescription>Select one or more roles for this user.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          {roles.map((role) => (
            <label key={role} className="flex items-center gap-2">
              <Checkbox
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => onChangeRoles(role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} size="sm">
            Save
          </Button>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// User Invitation Modal
function UserInvitationModal({
  open,
  onOpenChange,
  roles,
  onInvite
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: string[];
  onInvite: (user: { name: string; email: string; roles: string[] }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  function handleRole(role: string) {
    setSelectedRoles((r) => (r.includes(role) ? r.filter((x) => x !== role) : [...r, role]));
  }
  function handleSubmit() {
    onInvite({ name, email, roles: selectedRoles });
    setName("");
    setEmail("");
    setSelectedRoles([]);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>Send an invitation to a new user.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="mt-2 mb-1 font-semibold">Roles</div>
          {roles.map((role) => (
            <label key={role} className="flex items-center gap-2">
              <Checkbox
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => handleRole(role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} size="sm">
            Send Invite
          </Button>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Password Reset Modal
function PasswordResetModal({
  open,
  onOpenChange,
  onReset
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            This will send a password reset email to the user (mock only).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm">Are you sure you want to reset this user's password?</div>
        <DialogFooter>
          <Button
            onClick={() => {
              onReset();
              onOpenChange(false);
            }}
            size="sm">
            Reset
          </Button>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  // Mock user data with multi-role and activity history
  const mockUsers = [
    {
      id: "U12345",
      name: "Michael Johnson",
      email: "mjohnson@example.com",
      status: "active",
      roles: ["Veteran", "Admin"],
      lastLogin: "2 hours ago",
      avatar: "M",
      activity: [
        { type: "login", date: "2024-06-01 10:00" },
        { type: "password_change", date: "2024-05-30 09:00" }
      ]
    },
    {
      id: "U12346",
      name: "Sarah Williams",
      email: "swilliams@example.com",
      status: "active",
      roles: ["Veteran"],
      lastLogin: "1 day ago",
      avatar: "S",
      activity: [{ type: "login", date: "2024-06-01 08:00" }]
    },
    {
      id: "U12347",
      name: "Robert Davis",
      email: "rdavis@example.com",
      status: "inactive",
      roles: ["Veteran"],
      lastLogin: "3 weeks ago",
      avatar: "R",
      activity: [
        { type: "login", date: "2024-05-10 12:00" },
        { type: "password_change", date: "2024-05-01 11:00" }
      ]
    },
    {
      id: "U12348",
      name: "Jennifer Miller",
      email: "jmiller@example.com",
      status: "active",
      roles: ["Representative"],
      lastLogin: "5 hours ago",
      avatar: "J",
      activity: [{ type: "login", date: "2024-06-01 07:00" }]
    },
    {
      id: "U12349",
      name: "David Wilson",
      email: "dwilson@example.com",
      status: "active",
      roles: ["Admin"],
      lastLogin: "Just now",
      avatar: "D",
      activity: [{ type: "login", date: "2024-06-01 11:00" }]
    },
    {
      id: "U12350",
      name: "Lisa Brown",
      email: "lbrown@example.com",
      status: "active",
      roles: ["Veteran"],
      lastLogin: "3 days ago",
      avatar: "L",
      activity: [{ type: "login", date: "2024-05-29 10:00" }]
    },
    {
      id: "U12351",
      name: "Kevin Taylor",
      email: "ktaylor@example.com",
      status: "inactive",
      roles: ["Representative"],
      lastLogin: "2 months ago",
      avatar: "K",
      activity: [{ type: "login", date: "2024-04-01 09:00" }]
    },
    {
      id: "U12352",
      name: "Michelle Lee",
      email: "mlee@example.com",
      status: "active",
      roles: ["Veteran"],
      lastLogin: "12 hours ago",
      avatar: "M",
      activity: [{ type: "login", date: "2024-06-01 06:00" }]
    }
  ];

  // Mock roles and statuses
  const allRoles = ["Veteran", "Representative", "Admin"];
  const allStatuses = ["active", "inactive"];

  // State for search, filters, selection, and users
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState(mockUsers);

  // Filtered users (memoized)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter ? user.roles.includes(roleFilter) : true;
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Bulk selection logic
  function toggleSelectAll() {
    if (selected.length === filteredUsers.length) setSelected([]);
    else setSelected(filteredUsers.map((u) => u.id));
  }
  function toggleSelect(id: string) {
    setSelected((sel) => (sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]));
  }

  // Add state for modals
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [roleModalUser, setRoleModalUser] = useState<any>(null);
  const [resetModalUser, setResetModalUser] = useState<any>(null);
  const [bulkRoleMode, setBulkRoleMode] = useState(false);
  const [bulkResetMode, setBulkResetMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [roleDraft, setRoleDraft] = useState<string[]>([]);

  const { toast } = useToast();

  // Handler for opening role assignment modal (single user or bulk)
  function openRoleModal(user?: any) {
    if (user) {
      setRoleModalUser(user);
      setRoleDraft(user.roles);
      setBulkRoleMode(false);
    } else {
      setRoleModalUser(null);
      setRoleDraft([]);
      setBulkRoleMode(true);
    }
    setRoleModalOpen(true);
  }

  // Handler for saving roles (mock only)
  function handleSaveRoles() {
    if (bulkRoleMode) {
      setUsers((users) =>
        users.map((u) => (selected.includes(u.id) ? { ...u, roles: roleDraft } : u))
      );
      toast({ title: "Roles Updated", description: "Roles updated for selected users." });
    } else if (roleModalUser) {
      setUsers((users) =>
        users.map((u) => (u.id === roleModalUser.id ? { ...u, roles: roleDraft } : u))
      );
      toast({ title: "Roles Updated", description: `Roles updated for ${roleModalUser.name}.` });
    }
    setRoleModalOpen(false);
  }

  // Handler for opening password reset modal (single user or bulk)
  function openResetModal(user?: any) {
    if (user) {
      setResetModalUser(user);
      setBulkResetMode(false);
    } else {
      setResetModalUser(null);
      setBulkResetMode(true);
    }
    setResetModalOpen(true);
  }

  // Handler for resetting password (mock only)
  function handleResetPassword() {
    toast({
      title: "Password Reset",
      description: bulkResetMode
        ? "Password reset for selected users."
        : `Password reset for ${resetModalUser?.name}.`
    });
    setResetModalOpen(false);
  }

  // Handler for inviting user (mock only)
  function handleInviteUser(newUser: { name: string; email: string; roles: string[] }) {
    setUsers((users) => [
      ...users,
      {
        id: `U${Math.floor(Math.random() * 100000)}`,
        name: newUser.name,
        email: newUser.email,
        status: "active",
        roles: newUser.roles,
        lastLogin: "Never",
        avatar: newUser.name.charAt(0).toUpperCase(),
        activity: []
      }
    ]);
    toast({ title: "Invite Sent", description: `Invitation sent to ${newUser.email}.` });
  }

  // Handler for bulk actions (mock only)
  function handleBulkAction(action: string) {
    setBulkSelected(selected);
    if (action === "assign_roles") openRoleModal();
    if (action === "reset_password") openResetModal();
    // ... other bulk actions ...
    setSelected([]);
  }

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

  // Add state for user detail sheet
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<any>(null);

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">User Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Invite User</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>User Accounts</CardTitle>
            <p className="text-muted-foreground text-sm">Manage user accounts and permissions</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1">
                  <div className="mb-2">
                    <label className="mb-1 block text-xs">Role</label>
                    <select
                      className="w-full rounded border px-2 py-1 text-sm"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}>
                      <option value="">All</option>
                      {allRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs">Status</label>
                    <select
                      className="w-full rounded border px-2 py-1 text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="">All</option>
                      {allStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {(roleFilter || statusFilter || search) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setRoleFilter("");
                  setStatusFilter("");
                  setSearch("");
                }}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center gap-2">
            <Checkbox
              checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-muted-foreground text-xs">Select All</span>
            {selected.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                    <UserCheck className="mr-2 h-4 w-4" /> Activate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("suspend")}>
                    <UserX className="mr-2 h-4 w-4" /> Suspend
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("reset_password")}>
                    <Lock className="mr-2 h-4 w-4" /> Reset Password
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("assign_roles")}>
                    <ShieldAlert className="mr-2 h-4 w-4" /> Assign Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("invite")}>
                    <MailPlus className="mr-2 h-4 w-4" /> Invite
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("refresh")}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className={selected.includes(user.id) ? "bg-muted" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(user.id)}
                      onCheckedChange={() => toggleSelect(user.id)}
                    />
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatars/${user.id}.png`} alt={user.name} />
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground text-xs">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setDetailUser(user);
                            setDetailOpen(true);
                          }}>
                          <FileText className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openRoleModal(user)}>
                          <ShieldAlert className="mr-2 h-4 w-4" /> Edit Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openResetModal(user)}>
                          <Lock className="mr-2 h-4 w-4" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserCheck className="mr-2 h-4 w-4" /> Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserX className="mr-2 h-4 w-4" /> Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* User Detail Sheet (mock, only UI) */}
          <UserDetailSheet user={detailUser} open={detailOpen} onOpenChange={setDetailOpen} />
          {/* Role Assignment Modal (single user or bulk) */}
          <RoleAssignmentModal
            open={roleModalOpen}
            onOpenChange={setRoleModalOpen}
            roles={allRoles}
            selectedRoles={roleDraft}
            onChangeRoles={(role) =>
              setRoleDraft((draft) =>
                draft.includes(role) ? draft.filter((r) => r !== role) : [...draft, role]
              )
            }
            onSubmit={handleSaveRoles}
          />
          {/* User Invitation Modal */}
          <UserInvitationModal
            open={inviteModalOpen}
            onOpenChange={setInviteModalOpen}
            roles={allRoles}
            onInvite={handleInviteUser}
          />
          {/* Password Reset Modal (single user or bulk) */}
          <PasswordResetModal
            open={resetModalOpen}
            onOpenChange={setResetModalOpen}
            onReset={handleResetPassword}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="New Sign-ups"
          description="Monthly user registrations"
          data={userSignupsData}
          icon={<BarChartIcon className="text-muted-foreground h-5 w-5" />}
        />

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <p className="text-muted-foreground text-sm">Users by role and status</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">By Role</h3>
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
                <h3 className="mb-2 text-sm font-medium">By Status</h3>
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
