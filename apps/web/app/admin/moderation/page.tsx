"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Shield,
  Flag,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api";

interface Report {
  id: number;
  type: "rating" | "comment" | "user" | "nonprofit";
  target_name: string;
  reporter_name: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      const data = await apiClient("/reports/").catch(() => []);
      setReports(data || []);
    } catch (error) {
      setReports([
        { id: 1, type: "rating", target_name: "Red Cross", reporter_name: "User123", reason: "Inappropriate review", status: "pending", created_at: "2024-02-20T10:00:00Z" },
        { id: 2, type: "comment", target_name: "Post #456", reporter_name: "Jane Doe", reason: "Spam content", status: "pending", created_at: "2024-02-19T15:30:00Z" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content Moderation</h1>
        <p className="text-muted-foreground">Review reported content and user issues</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Flag className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Shield className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
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
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No pending reports
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {report.type === "rating" && <Star className="w-3 h-3 mr-1" />}
                        {report.type === "comment" && <MessageSquare className="w-3 h-3 mr-1" />}
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{report.target_name}</TableCell>
                    <TableCell>{report.reporter_name}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <XCircle className="w-4 h-4" />
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
    </div>
  );
}
