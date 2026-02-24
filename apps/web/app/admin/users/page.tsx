"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Loader2,
  Users,
  Shield,
  UserX,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  altruepoints: number;
  altrue_level?: {
    name: string;
    level_number: number;
  };
  donation_total: number;
  last_login?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await apiClient("/users/");
      setUsers(data.results || data || []);
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([
        { id: 1, username: "johndoe", email: "john@example.com", first_name: "John", last_name: "Doe", is_staff: false, is_active: true, date_joined: "2024-01-01", altruepoints: 5000, altrue_level: { name: "Gold", level_number: 5 }, donation_total: 1200 },
        { id: 2, username: "admin", email: "admin@altrue.global", first_name: "Admin", last_name: "User", is_staff: true, is_active: true, date_joined: "2023-12-01", altruepoints: 10000, altrue_level: { name: "Platinum", level_number: 8 }, donation_total: 5000 },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserStatus(userId: number, currentStatus: boolean) {
    try {
      await apiClient(`/users/${userId}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, is_active: !currentStatus } : u))
      );
      toast.success(`User ${currentStatus ? "suspended" : "activated"}`);
    } catch (error) {
      toast.error("Failed to update user status");
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View and manage platform users</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.is_staff).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <UserX className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => !u.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Donated</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                          <span className="text-[#D4AF37] font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            {user.is_staff && (
                              <Badge className="bg-purple-100 text-purple-700">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.username} • {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {user.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#D4AF37] font-medium">
                        {user.altruepoints?.toLocaleString() || 0} pts
                      </span>
                      {user.altrue_level && (
                        <p className="text-xs text-muted-foreground">
                          Level {user.altrue_level.level_number}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      ${user.donation_total?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      {new Date(user.date_joined).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className={user.is_active ? "text-red-500" : "text-green-500"}
                        >
                          {user.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <span className="text-2xl text-[#D4AF37] font-bold">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Joined</Label>
                  <p>{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Points</Label>
                  <p className="text-[#D4AF37] font-bold">
                    {selectedUser.altruepoints?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Donated</Label>
                  <p className="text-green-600 font-bold">
                    ${selectedUser.donation_total?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
