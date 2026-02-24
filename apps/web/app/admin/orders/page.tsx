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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  MapPin,
  CreditCard,
  Coins,
  DollarSign,
  Loader2,
  ExternalLink,
  Printer,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface OrderItem {
  id: number;
  ordered_shirt: {
    id: number;
    name: string;
    price: number;
    discount_price?: number;
    image?: string;
  };
  quantity: number;
  color?: {
    id: number;
    name: string;
  };
  size?: {
    id: number;
    name: string;
  };
  get_final_price?: number;
}

interface Order {
  pk?: number;
  id?: number;
  status: "pending" | "in_production" | "shipped" | "delivered" | "cancelled";
  payment_type?: 1 | 2 | 3;
  user: {
    username: string;
    email?: string;
    id?: number;
  };
  shirts: OrderItem[];
  ordered_date: string;
  paid_for: boolean;
  completed: boolean;
  points_paid?: number;
  amount_paid?: number;
  stripe_id?: string;
  tracking_number?: string;
  carrier?: string;
  tracking_url?: string;
  printful_fullfillment_started?: boolean;
  fullfillment_id?: string;
}

const PAYMENT_TYPE_LABELS: Record<number, string> = {
  1: "Card",
  2: "Altrue Points",
  3: "Hybrid",
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { value: "in_production", label: "In Production", color: "bg-blue-100 text-blue-700" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-700" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

function getStatusBadge(status: string) {
  const option = STATUS_OPTIONS.find((o) => o.value === status);
  return option ? option.color : "bg-gray-100 text-gray-700";
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "in_production":
      return <Package className="w-4 h-4" />;
    case "shipped":
      return <Truck className="w-4 h-4" />;
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    tracking_number: "",
    carrier: "",
    tracking_url: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await apiClient("/order/");
      const ordersArray = Array.isArray(data) ? data : data?.results || [];
      
      console.log("Raw orders:", ordersArray);
      
      // Transform and enrich order data
      const transformedOrders = ordersArray.map((o: any) => ({
        ...o,
        id: o.pk || o.id,
        // Calculate total from shirts if not provided
        total_amount: o.amount_paid || o.shirts?.reduce((sum: number, s: any) => {
          const price = s.ordered_shirt?.discount_price || s.ordered_shirt?.price || 0;
          return sum + (price * (s.quantity || 1));
        }, 0) || 0,
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders from backend");
      // Mock data for development
      setOrders([
        {
          id: 1,
          status: "pending",
          payment_type: 1,
          user: { username: "john_doe", email: "john@example.com" },
          shirts: [
            { id: 1, ordered_shirt: { id: 1, name: "Hope Tee", price: 29.99, image: "" }, quantity: 2, color: { id: 1, name: "Black" }, size: { id: 1, name: "M" } },
          ],
          ordered_date: "2024-02-23T10:00:00Z",
          paid_for: true,
          completed: false,
          amount_paid: 59.98,
        },
        {
          id: 2,
          status: "shipped",
          payment_type: 3,
          user: { username: "jane_smith", email: "jane@example.com" },
          shirts: [
            { id: 2, ordered_shirt: { id: 2, name: "Charity Hoodie", price: 49.99, image: "" }, quantity: 1, color: { id: 2, name: "Navy" }, size: { id: 2, name: "L" } },
            { id: 3, ordered_shirt: { id: 3, name: "Impact Cap", price: 24.99, image: "" }, quantity: 1, color: { id: 3, name: "White" }, size: { id: 3, name: "One Size" } },
          ],
          ordered_date: "2024-02-22T15:30:00Z",
          paid_for: true,
          completed: false,
          points_paid: 500,
          amount_paid: 49.99,
          tracking_number: "1Z999AA10123456784",
          carrier: "UPS",
          tracking_url: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
      setUpdating(true);
      await apiClient(`/order/${orderId}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
      
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  }

  async function updateTracking(orderId: number) {
    try {
      setUpdating(true);
      await apiClient(`/order/${orderId}/`, {
        method: "PATCH",
        body: JSON.stringify({
          tracking_number: trackingForm.tracking_number,
          carrier: trackingForm.carrier,
          tracking_url: trackingForm.tracking_url,
        }),
      });
      
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                tracking_number: trackingForm.tracking_number,
                carrier: trackingForm.carrier,
                tracking_url: trackingForm.tracking_url,
              }
            : o
        )
      );
      
      toast.success("Tracking information updated");
      setIsTrackingOpen(false);
    } catch (error) {
      console.error("Failed to update tracking:", error);
      toast.error("Failed to update tracking information");
    } finally {
      setUpdating(false);
    }
  }

  function openTrackingDialog(order: Order) {
    setSelectedOrder(order);
    setTrackingForm({
      tracking_number: order.tracking_number || "",
      carrier: order.carrier || "",
      tracking_url: order.tracking_url || "",
    });
    setIsTrackingOpen(true);
  }

  function openDetails(order: Order) {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toString().includes(searchQuery) ||
      order.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.payment_type?.toString() === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Statistics
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProduction: orders.filter((o) => o.status === "in_production").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.amount_paid || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage shirt orders, fulfillment, and shipping
          </p>
        </div>
        <Button onClick={fetchOrders} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Production</CardTitle>
            <Package className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProduction}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, user, email, or tracking #"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Types</SelectItem>
            <SelectItem value="1">Card</SelectItem>
            <SelectItem value="2">Altrue Points</SelectItem>
            <SelectItem value="3">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user?.username}</p>
                        <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.shirts?.length || 0} items</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${(order.amount_paid || 0).toFixed(2)}
                      </div>
                      {order.points_paid ? (
                        <p className="text-xs text-muted-foreground">
                          {order.points_paid.toLocaleString()} pts
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {order.payment_type === 2 ? (
                          <Coins className="w-4 h-4 text-[#D4AF37]" />
                        ) : order.payment_type === 3 ? (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <Coins className="w-3 h-3 text-[#D4AF37]" />
                          </>
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {PAYMENT_TYPE_LABELS[order.payment_type || 1]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {STATUS_OPTIONS.find((o) => o.value === order.status)?.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.ordered_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.tracking_number ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{order.carrier}</span>
                          <a
                            href={order.tracking_url || `#`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {order.tracking_number}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetails(order)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openTrackingDialog(order)}
                          title="Add/Edit Tracking"
                        >
                          <MapPin className="w-4 h-4" />
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

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id} Details</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder?.ordered_date && new Date(selectedOrder.ordered_date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusBadge(selectedOrder.status)}>
                    {STATUS_OPTIONS.find((o) => o.value === selectedOrder.status)?.label}
                  </Badge>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Payment Type</p>
                  <p className="font-medium">
                    {PAYMENT_TYPE_LABELS[selectedOrder.payment_type || 1]}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">${(selectedOrder.amount_paid || 0).toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Points Used</p>
                  <p className="font-medium">
                    {selectedOrder.points_paid ? selectedOrder.points_paid.toLocaleString() : "0"}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{selectedOrder.user?.username}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
                  <p className="text-sm text-muted-foreground">User ID: {selectedOrder.user?.id}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.shirts?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        {item.ordered_shirt?.image ? (
                          <img
                            src={item.ordered_shirt.image}
                            alt={item.ordered_shirt.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.ordered_shirt?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Color: {item.color?.name || "N/A"} | Size: {item.size?.name || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          $
                          {(
                            (item.ordered_shirt?.discount_price ||
                              item.ordered_shirt?.price || 0) * item.quantity
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${(item.ordered_shirt?.discount_price || item.ordered_shirt?.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Info */}
              {selectedOrder.tracking_number && (
                <div>
                  <h4 className="font-semibold mb-2">Shipping Information</h4>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="font-medium">{selectedOrder.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking Number:</span>
                      <a
                        href={selectedOrder.tracking_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {selectedOrder.tracking_number}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h4 className="font-semibold mb-2">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={selectedOrder.status === opt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id!, opt.value)}
                      disabled={updating || selectedOrder.status === opt.value}
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Update Dialog */}
      <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Tracking Information</DialogTitle>
            <DialogDescription>
              Add or update shipping details for Order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={trackingForm.carrier}
                onChange={(e) =>
                  setTrackingForm((prev) => ({ ...prev, carrier: e.target.value }))
                }
                placeholder="e.g., UPS, FedEx, USPS"
              />
            </div>
            <div>
              <Label htmlFor="tracking_number">Tracking Number</Label>
              <Input
                id="tracking_number"
                value={trackingForm.tracking_number}
                onChange={(e) =>
                  setTrackingForm((prev) => ({
                    ...prev,
                    tracking_number: e.target.value,
                  }))
                }
                placeholder="e.g., 1Z999AA10123456784"
              />
            </div>
            <div>
              <Label htmlFor="tracking_url">Tracking URL (optional)</Label>
              <Input
                id="tracking_url"
                value={trackingForm.tracking_url}
                onChange={(e) =>
                  setTrackingForm((prev) => ({ ...prev, tracking_url: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrackingOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedOrder && updateTracking(selectedOrder.id!)}
              disabled={updating || !trackingForm.tracking_number}
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Tracking Info
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
