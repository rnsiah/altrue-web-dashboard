"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Package,
  ArrowRight,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface Payment {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  type: "donation" | "purchase";
  status: "completed" | "pending" | "failed" | "refunded";
  recipient?: string;
  stripe_id?: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dataSource, setDataSource] = useState<"api" | "mock" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const [donations, orders] = await Promise.all([
        apiClient("/userdonations/").catch((e) => { 
          console.log("Donations fetch failed:", e); 
          setErrorMessage(prev => prev || "Failed to fetch donations");
          return []; 
        }),
        apiClient("/order/").catch((e) => { 
          console.log("Orders fetch failed:", e); 
          setErrorMessage(prev => prev || "Failed to fetch orders");
          return []; 
        }),
      ]);
      
      console.log("Raw donations:", donations);
      console.log("Raw orders:", orders);
      
      const donationsArray = Array.isArray(donations) ? donations : donations?.results || [];
      const ordersArray = Array.isArray(orders) ? orders : orders?.results || [];
      
      // Check if we got real data
      const hasRealData = donationsArray.length > 0 || ordersArray.length > 0;
      
      if (hasRealData) {
        setDataSource("api");
      } else {
        setDataSource("mock");
        setErrorMessage("No data from backend - showing mock data");
      }
      
      // Transform donations to match Payment interface
      const transformedDonations = donationsArray.map((d: any) => ({
        id: d.id,
        user_name: d.user?.username || "Unknown",
        user_email: d.user?.email || "",
        amount: parseFloat(d.dollar_amount || 0),
        type: "donation" as const,
        status: d.paid_for ? "completed" : "pending",
        recipient: d.nonprofit?.name || d.atrocity?.title || d.project?.title || "Unknown",
        stripe_id: d.stripe_id,
        created_at: d.donation_date,
      }));
      
      // Transform orders to match Payment interface
      const transformedOrders = ordersArray.map((o: any) => {
        // Calculate total from shirts if amount_paid is not available
        let orderTotal = parseFloat(o.amount_paid || 0);
        if (!orderTotal && o.shirts) {
          orderTotal = o.shirts.reduce((sum: number, shirt: any) => {
            const price = parseFloat(shirt.ordered_shirt?.price || 0);
            const qty = shirt.quantity || 1;
            return sum + (price * qty);
          }, 0);
        }
        
        return {
          id: o.pk || o.id,
          user_name: o.user?.username || "Unknown",
          user_email: o.user?.email || "",
          amount: orderTotal,
          type: "purchase" as const,
          status: o.status || (o.paid_for ? "completed" : "pending"),
          recipient: "Altrue Store",
          stripe_id: o.stripe_id,
          created_at: o.ordered_date,
        };
      });
      
      const allPayments = [...transformedDonations, ...transformedOrders].sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      
      console.log("Transformed payments:", allPayments);
      
      // Only use real data if we have it, otherwise fall back to mock
      if (allPayments.length > 0) {
        setPayments(allPayments);
      } else {
        throw new Error("No data from API");
      }
    } catch (error) {
      console.error("Fetch payments error:", error);
      setDataSource("mock");
      setErrorMessage("Backend connection failed - showing sample data");
      setPayments([
        { id: 1, user_name: "John Doe", user_email: "john@example.com", amount: 100, type: "donation", status: "completed", recipient: "Red Cross", created_at: "2024-02-20T10:00:00Z" },
        { id: 2, user_name: "Jane Smith", user_email: "jane@example.com", amount: 250, type: "donation", status: "completed", recipient: "Save the Children", created_at: "2024-02-20T09:30:00Z" },
        { id: 3, user_name: "Bob Johnson", user_email: "bob@example.com", amount: 49.99, type: "purchase", status: "pending", created_at: "2024-02-20T09:00:00Z" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filteredPayments = payments.filter(
    (p) => statusFilter === "all" || p.status === statusFilter
  );

  const totalVolume = payments.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Donations & Payments</h1>
          <p className="text-muted-foreground">View donation transactions and payment records</p>
          <p className="text-xs text-muted-foreground mt-1">
            For order/shipment management, go to <a href="/admin/orders" className="text-blue-600 hover:underline">Orders</a>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/admin/orders">
              <Package className="w-4 h-4 mr-2" />
              Manage Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button
            onClick={fetchPayments}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalVolume.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {payments.filter((p) => p.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter((p) => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed/Refunded</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {payments.filter((p) => ["failed", "refunded"].includes(p.status)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {dataSource && (
            <Badge className={dataSource === "api" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {dataSource === "api" ? "Live Data" : "Sample Data"}
            </Badge>
          )}
          {errorMessage && (
            <span className="text-sm text-muted-foreground">{errorMessage}</span>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user_name}</p>
                        <p className="text-sm text-muted-foreground">{payment.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={payment.type === "donation" ? "default" : "secondary"}>
                        {payment.type === "donation" ? "🎁 Donation" : "🛍️ Purchase"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${(payment.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>{payment.recipient || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          payment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.stripe_id ? (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{payment.stripe_id}</code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
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
