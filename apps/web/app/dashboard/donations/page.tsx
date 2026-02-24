"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/data-table";
import { Loader2, Heart, DollarSign } from "lucide-react";
import { getDonations, getNonProfits } from "@/lib/api";

interface Donation {
  id: string;
  amount: number;
  nonprofit_name?: string;
  message?: string;
  created_at: string;
  is_anonymous: boolean;
  donor_display_name?: string;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | undefined>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchDonations() {
      try {
        setLoading(true);
        const data = await getDonations();
        const donationList = data.results || data || [];
        setDonations(donationList);
      } catch (err) {
        setError("Failed to load donations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDonations();
  }, []);

  // Sort donations
  const sortedDonations = [...donations].sort((a, b) => {
    if (!sortColumn) return 0;
    let aVal: any = a[sortColumn as keyof Donation];
    let bVal: any = b[sortColumn as keyof Donation];
    
    if (aVal === null || aVal === undefined) aVal = "";
    if (bVal === null || bVal === undefined) bVal = "";
    
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedDonations = sortedDonations.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const totalAmount = donations.reduce((sum, d) => sum + (parseFloat(d.amount as any) || 0), 0);

  const columns: Column<Donation>[] = [
    {
      key: "nonprofit_name",
      header: "Non-Profit",
      cell: (donation) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Heart size={14} className="text-[#D4AF37]" />
          </div>
          <span className="font-medium">{donation.nonprofit_name || "Unknown"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (donation) => (
        <span className="font-bold text-green-600">
          ${parseFloat(donation.amount as any).toFixed(2)}
        </span>
      ),
      sortable: true,
    },
    {
      key: "message",
      header: "Message",
      cell: (donation) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {donation.message || "-"}
        </span>
      ),
      sortable: false,
    },
    {
      key: "is_anonymous",
      header: "Anonymous",
      cell: (donation) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          donation.is_anonymous
            ? "bg-gray-100 text-gray-700"
            : "bg-blue-100 text-blue-700"
        }`}>
          {donation.is_anonymous ? "Yes" : "No"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "created_at",
      header: "Date",
      cell: (donation) => (
        donation.created_at 
          ? new Date(donation.created_at).toLocaleDateString()
          : "-"
      ),
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
        <h2 className="text-2xl font-bold tracking-tight">Donations</h2>
        <p className="text-muted-foreground">
          Track and manage all donations across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Heart className="w-4 h-4 text-[#D4AF37]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${donations.length ? (totalAmount / donations.length).toFixed(2) : "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donations ({donations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <DataTable
              data={paginatedDonations}
              columns={columns}
              keyExtractor={(donation) => donation.id}
              totalCount={donations.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              emptyMessage="No donations found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
