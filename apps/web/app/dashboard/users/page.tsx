"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { getUsers } from "@/lib/api";

interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const data = await getUsers();
        // Handle both paginated ({results: [...]}) and array responses
        const userList = data.results || data || [];
        setUsers(userList);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;
    let aVal: any = a[sortColumn as keyof User];
    let bVal: any = b[sortColumn as keyof User];
    
    // Handle nested/computed fields
    if (sortColumn === "name") {
      aVal = a.first_name || a.username || a.email;
      bVal = b.first_name || b.username || b.email;
    }
    
    if (aVal === null || aVal === undefined) aVal = "";
    if (bVal === null || bVal === undefined) bVal = "";
    
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }, [sortColumn]);

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      cell: (user) => {
        const displayName = user.first_name || user.username || user.email;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-medium">
              {displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-medium">{displayName}</div>
              {user.username && user.username !== displayName && (
                <div className="text-xs text-muted-foreground">@{user.username}</div>
              )}
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      cell: (user) => user.email,
      sortable: true,
    },
    {
      key: "is_staff",
      header: "Role",
      cell: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.is_staff
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}>
          {user.is_staff ? "Admin" : "User"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.is_active
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
        }`}>
          {user.is_active ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "date_joined",
      header: "Joined",
      cell: (user) => user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "-",
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage your team members and their permissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <DataTable
              data={paginatedUsers}
              columns={columns}
              keyExtractor={(user) => user.id}
              totalCount={filteredUsers.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
