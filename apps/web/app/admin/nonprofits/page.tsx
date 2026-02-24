"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Building2,
  Clock,
  Filter,
  Download,
  Plus,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/admin-sidebar";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface Nonprofit {
  id: number;
  name: string;
  description: string;
  mission_statement?: string;
  vision_statement?: string;
  year_started?: number;
  website_url?: string;
  facebook?: string;
  logo?: string;
  main_image?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  owner_name: string;
  owner_email: string;
  total_balance: number;
  no_of_ratings: number;
  average_rating: number;
  created_at: string;
  category?: string[];
}

export default function NonprofitsPage() {
  const router = useRouter();
  const [nonprofits, setNonprofits] = useState<Nonprofit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchNonprofits();
  }, []);

  async function fetchNonprofits() {
    try {
      setLoading(true);
      const data = await apiClient("/nonprofits/");
      const nonprofitsArray = Array.isArray(data) ? data : data?.results || [];
      // Ensure status field exists
      const transformedNonprofits = nonprofitsArray.map((n: any) => ({
        ...n,
        status: n.status || "pending",
      }));
      setNonprofits(transformedNonprofits);
    } catch (error) {
      toast.error("Failed to load nonprofits");
      console.error(error);
      // Mock data for development
      setNonprofits([
        {
          id: 1,
          name: "Red Cross",
          description: "Humanitarian organization providing emergency assistance",
          mission_statement: "To prevent and alleviate human suffering",
          vision_statement: "A world with zero humanitarian crises",
          year_started: 1881,
          website_url: "https://redcross.org",
          status: "approved",
          owner_name: "John Smith",
          owner_email: "john@redcross.org",
          total_balance: 125000,
          no_of_ratings: 45,
          average_rating: 4.8,
          created_at: "2024-01-15",
          category: ["Health", "Emergency"],
        },
        {
          id: 2,
          name: "New Hope Foundation",
          description: "Education for underprivileged children",
          mission_statement: "Every child deserves education",
          status: "pending",
          owner_name: "Sarah Johnson",
          owner_email: "sarah@newhope.org",
          total_balance: 0,
          no_of_ratings: 0,
          average_rating: 0,
          created_at: "2024-02-20",
          category: ["Education"],
        },
        {
          id: 3,
          name: "Green Earth Initiative",
          description: "Environmental conservation programs",
          status: "pending",
          owner_name: "Mike Chen",
          owner_email: "mike@greenearth.org",
          total_balance: 0,
          no_of_ratings: 0,
          average_rating: 0,
          created_at: "2024-02-21",
          category: ["Environment"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!selectedNonprofit) return;
    
    try {
      await apiClient(`/nonprofits/${selectedNonprofit.id}/approve/`, {
        method: "POST",
      });
      toast.success(`${selectedNonprofit.name} has been approved`);
      setIsApproveDialogOpen(false);
      fetchNonprofits();
    } catch (error) {
      toast.error("Failed to approve nonprofit");
      console.error(error);
      // Update locally for demo
      setNonprofits(prev =>
        prev.map(n =>
          n.id === selectedNonprofit.id ? { ...n, status: "approved" as const } : n
        )
      );
      setIsApproveDialogOpen(false);
      toast.success(`${selectedNonprofit.name} has been approved`);
    }
  }

  async function handleReject() {
    if (!selectedNonprofit) return;
    
    try {
      await apiClient(`/nonprofits/${selectedNonprofit.id}/reject/`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectionReason }),
      });
      toast.success(`${selectedNonprofit.name} has been rejected`);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      fetchNonprofits();
    } catch (error) {
      toast.error("Failed to reject nonprofit");
      console.error(error);
      // Update locally for demo
      setNonprofits(prev =>
        prev.map(n =>
          n.id === selectedNonprofit.id ? { ...n, status: "rejected" as const } : n
        )
      );
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      toast.success(`${selectedNonprofit.name} has been rejected`);
    }
  }

  async function handleDelete() {
    if (!selectedNonprofit) return;
    
    try {
      await apiClient(`/nonprofits/${selectedNonprofit.id}/`, {
        method: "DELETE",
      });
      toast.success(`${selectedNonprofit.name} has been deleted`);
      setNonprofits(prev => prev.filter(n => n.id !== selectedNonprofit.id));
    } catch (error) {
      toast.error("Failed to delete nonprofit");
    }
  }

  const filteredNonprofits = nonprofits.filter((nonprofit) => {
    const matchesSearch =
      nonprofit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nonprofit.owner_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || nonprofit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = nonprofits.filter((n) => n.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nonprofit Management</h1>
          <p className="text-muted-foreground">
            Review, approve, and manage nonprofit organizations
          </p>
        </div>
        <Button onClick={() => toast.info("Create nonprofit - Coming soon")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Nonprofit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nonprofits</CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nonprofits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {nonprofits.filter((n) => n.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <span className="text-2xl font-bold text-[#D4AF37]">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#D4AF37]">
              {nonprofits
                .reduce((sum, n) => sum + (n.total_balance || 0), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search nonprofits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredNonprofits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No nonprofits found
                  </TableCell>
                </TableRow>
              ) : (
                filteredNonprofits.map((nonprofit) => (
                  <TableRow key={nonprofit.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {nonprofit.logo ? (
                            <img
                              src={nonprofit.logo}
                              alt={nonprofit.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{nonprofit.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {nonprofit.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{nonprofit.owner_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {nonprofit.owner_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={nonprofit.status} />
                    </TableCell>
                    <TableCell>
                      ${nonprofit.total_balance?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      {nonprofit.no_of_ratings > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{nonprofit.average_rating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-xs">
                            ({nonprofit.no_of_ratings})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No ratings</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(nonprofit.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedNonprofit(nonprofit);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedNonprofit(nonprofit);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {nonprofit.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedNonprofit(nonprofit);
                                  setIsApproveDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedNonprofit(nonprofit);
                                  setIsRejectDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedNonprofit(nonprofit);
                              handleDelete();
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nonprofit Details</DialogTitle>
          </DialogHeader>
          {selectedNonprofit && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  {selectedNonprofit.logo ? (
                    <img
                      src={selectedNonprofit.logo}
                      alt={selectedNonprofit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedNonprofit.name}</h3>
                  <StatusBadge status={selectedNonprofit.status} />
                  <p className="text-muted-foreground mt-2">
                    {selectedNonprofit.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mission</Label>
                  <p className="text-sm mt-1">
                    {selectedNonprofit.mission_statement || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vision</Label>
                  <p className="text-sm mt-1">
                    {selectedNonprofit.vision_statement || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Year Started</Label>
                  <p className="text-sm mt-1">{selectedNonprofit.year_started || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Website</Label>
                  <p className="text-sm mt-1">
                    {selectedNonprofit.website_url ? (
                      <a
                        href={selectedNonprofit.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Facebook</Label>
                  <p className="text-sm mt-1">
                    {selectedNonprofit.facebook || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Owner Information</h4>
                <p className="text-sm">
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {selectedNonprofit.owner_name}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {selectedNonprofit.owner_email}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#D4AF37]">
                      ${selectedNonprofit.total_balance?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Raised</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {selectedNonprofit.average_rating > 0
                        ? selectedNonprofit.average_rating.toFixed(1)
                        : "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {selectedNonprofit.no_of_ratings}
                    </p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedNonprofit?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsRejectDialogOpen(true);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsApproveDialogOpen(true);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Nonprofit</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve{" "}
              <span className="font-medium">{selectedNonprofit?.name}</span>? This will
              make them visible to all users on the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Nonprofit</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting{" "}
              <span className="font-medium">{selectedNonprofit?.name}</span>. This will
              be sent to the applicant.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
