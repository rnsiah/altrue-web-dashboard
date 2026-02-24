"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Building2,
  Gift,
  Clock,
  CheckCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface DashboardStats {
  totalUsers: number;
  totalDonations: number;
  totalNonprofits: number;
  pendingApprovals: number;
  activeCampaigns: number;
  totalRevenue: number;
  userGrowth: number;
  donationGrowth: number;
}

interface RecentActivity {
  id: number;
  type: "donation" | "user" | "nonprofit" | "campaign";
  message: string;
  timestamp: string;
  amount?: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Fetch multiple endpoints in parallel
      const [users, nonprofits, donations, stats] = await Promise.all([
        apiClient("/users/").catch(() => ({ count: 0 })),
        apiClient("/nonprofits/").catch(() => ({ results: [] })),
        apiClient("/userdonations/").catch(() => []),
        apiClient("/altruestatistics/").catch(() => null),
      ]);

      const nonprofitList = nonprofits.results || nonprofits || [];
      const pendingCount = nonprofitList.filter((n: any) => n.status === "pending").length;

      setStats({
        totalUsers: users.count || 0,
        totalDonations: donations.length || 0,
        totalNonprofits: nonprofitList.length,
        pendingApprovals: pendingCount,
        activeCampaigns: 18,
        totalRevenue: stats?.total_donations || 0,
        userGrowth: 12.5,
        donationGrowth: 23.1,
      });

      // Mock recent activities
      setActivities([
        { id: 1, type: "nonprofit", message: "New Hope Foundation submitted for approval", timestamp: "5 minutes ago" },
        { id: 2, type: "donation", message: "$500 donation to Red Cross", timestamp: "12 minutes ago", amount: 500 },
        { id: 3, type: "user", message: "New user registration: sarah@example.com", timestamp: "25 minutes ago" },
        { id: 4, type: "campaign", message: "Winter Relief campaign reached 80% goal", timestamp: "1 hour ago" },
        { id: 5, type: "donation", message: "$250 donation to Save the Children", timestamp: "2 hours ago", amount: 250 },
      ]);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      // Use mock data
      setStats({
        totalUsers: 1245,
        totalDonations: 3420,
        totalNonprofits: 28,
        pendingApprovals: 3,
        activeCampaigns: 18,
        totalRevenue: 485000,
        userGrowth: 12.5,
        donationGrowth: 23.1,
      });
      setActivities([
        { id: 1, type: "nonprofit", message: "New Hope Foundation submitted for approval", timestamp: "5 minutes ago" },
        { id: 2, type: "donation", message: "$500 donation to Red Cross", timestamp: "12 minutes ago", amount: 500 },
        { id: 3, type: "user", message: "New user registration: sarah@example.com", timestamp: "25 minutes ago" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers.toLocaleString() || "0",
      change: `+${stats?.userGrowth}%`,
      trend: "up" as const,
      icon: <Users className="w-5 h-5" />,
      href: "/admin/users",
    },
    {
      title: "Total Donations",
      value: stats?.totalDonations.toLocaleString() || "0",
      change: `+${stats?.donationGrowth}%`,
      trend: "up" as const,
      icon: <Heart className="w-5 h-5" />,
      href: "/admin/payments",
    },
    {
      title: "Nonprofits",
      value: stats?.totalNonprofits.toString() || "0",
      icon: <Building2 className="w-5 h-5" />,
      href: "/admin/nonprofits",
      badge: stats?.pendingApprovals,
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: "+15.3%",
      trend: "up" as const,
      icon: <DollarSign className="w-5 h-5" />,
      href: "/admin/payments",
    },
  ];

  const quickActions = [
    {
      title: "Review Pending Nonprofits",
      description: `${stats?.pendingApprovals || 0} awaiting approval`,
      href: "/admin/nonprofits",
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      urgent: (stats?.pendingApprovals || 0) > 0,
    },
    {
      title: "Manage Products",
      description: "Add or update rewards",
      href: "/admin/products",
      icon: <Gift className="w-5 h-5 text-[#D4AF37]" />,
    },
    {
      title: "View Reports",
      description: "Analytics and exports",
      href: "#",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Moderate Content",
      description: "Review reports and ratings",
      href: "/admin/moderation",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform, review submissions, and monitor activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{card.value}</div>
                      {card.badge ? (
                        <Badge className="bg-red-500 text-white">
                          {card.badge} pending
                        </Badge>
                      ) : null}
                    </div>
                    {card.change && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        {card.trend === "up" ? (
                          <ArrowUpRight size={14} className="text-green-500" />
                        ) : (
                          <ArrowDownRight size={14} className="text-red-500" />
                        )}
                        <span
                          className={
                            card.trend === "up" ? "text-green-500" : "text-red-500"
                          }
                        >
                          {card.change}
                        </span>
                        <span>from last month</span>
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  action.urgent
                    ? "border-yellow-500/50 bg-yellow-50/50 hover:bg-yellow-50"
                    : "hover:bg-accent"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${action.urgent ? "text-yellow-700" : ""}`}>
                    {action.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                {action.urgent && (
                  <Badge className="bg-yellow-500 text-white shrink-0">Action Needed</Badge>
                )}
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "donation"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "nonprofit"
                        ? "bg-yellow-100 text-yellow-600"
                        : activity.type === "campaign"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {activity.type === "donation" ? (
                      <DollarSign className="w-4 h-4" />
                    ) : activity.type === "nonprofit" ? (
                      <Building2 className="w-4 h-4" />
                    ) : activity.type === "campaign" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    {activity.amount && (
                      <p className="text-sm text-green-600 font-medium">
                        ${activity.amount}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Users", href: "/admin/users", count: stats?.totalUsers },
          { title: "Nonprofits", href: "/admin/nonprofits", count: stats?.totalNonprofits },
          { title: "Products", href: "/admin/products", count: undefined },
          { title: "Companies", href: "/admin/companies", count: undefined },
        ].map((link) => (
          <Link key={link.title} href={link.href}>
            <Button variant="outline" className="w-full justify-between h-auto py-4">
              <span className="font-medium">Manage {link.title}</span>
              {link.count !== undefined && (
                <Badge variant="secondary">{link.count}</Badge>
              )}
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
