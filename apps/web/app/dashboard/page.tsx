"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Heart, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Activity,
  Radio,
  Trophy,
  Target,
  Building2,
  BarChart3,
} from "lucide-react";
import { getDashboardData } from "@/lib/api";
import { 
  LiveUserChart, 
  LiveDonationChart, 
  LiveRevenueChart,
  DonationCategoryChart,
  LiveActivityFeed 
} from "@/components/dashboard/live-charts";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { CompanyMatchingCard } from "@/components/dashboard/company-matching-card";
import { GamificationStatsCard } from "@/components/dashboard/gamification-stats-card";
import { TopNonprofitsCard } from "@/components/dashboard/top-nonprofits-card";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { toast } from "@/components/ui/toaster";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
  loading?: boolean;
  live?: boolean;
}

function MetricCard({ title, value, change, trend, icon, loading, live }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {title}
          {live && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </span>
          )}
        </CardTitle>
        <div className="w-8 h-8 rounded-md bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 flex items-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && trend && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {trend === "up" ? (
                  <ArrowUpRight size={14} className="text-green-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-500" />
                )}
                <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
                  {change}
                </span>
                <span>from last month</span>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveConnected, setLiveConnected] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData();
        setData(dashboardData);
        
        // Simulate WebSocket connection status
        setTimeout(() => setLiveConnected(true), 2000);
      } catch (err) {
        setError("Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Extract stats from API response
  const totalUsers = data?.totalUsers || 0;
  const stats = data?.stats || {};

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: <Users size={18} />,
      live: true,
    },
    {
      title: "Total Donations",
      value: stats?.total_donations ? `$${stats.total_donations.toLocaleString()}` : "$0",
      change: "+23.1%",
      trend: "up" as const,
      icon: <Heart size={18} />,
      live: true,
    },
    {
      title: "Active Campaigns",
      value: "18",
      change: "+4",
      trend: "up" as const,
      icon: <TrendingUp size={18} />,
    },
    {
      title: "Avg. Donation",
      value: "$124",
      change: "-2.3%",
      trend: "down" as const,
      icon: <DollarSign size={18} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your platform.
          </p>
        </div>
        {liveConnected && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <Radio className="w-4 h-4 animate-pulse" />
            Real-time connected
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} loading={loading} />
        ))}
      </div>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
      )}

      {/* Live Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LiveUserChart />
        <LiveDonationChart />
        <LiveRevenueChart />
      </div>

      {/* Bottom Section: Activity Feed and Category Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveActivityFeed />
        </div>
        <div>
          <DonationCategoryChart />
        </div>
      </div>

      {/* NEW: Social & Gamification Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-lg font-semibold">Gamification & Social</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LeaderboardCard />
          <GamificationStatsCard />
          <CompanyMatchingCard />
          <TopNonprofitsCard />
        </div>
      </div>

      {/* NEW: User Growth Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-lg font-semibold">Growth Analytics</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <UserGrowthChart />
          
          {/* Recent Users */}
          <Card className="h-[350px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users size={18} />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto h-[250px]">
                  {data?.users?.slice(0, 8).map((user: any, i: number) => (
                    <div key={user.id || i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                        <span className="text-[#D4AF37] font-bold">
                          {(user.username || user.email || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.username || user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(user.date_joined).toLocaleDateString()}
                        </p>
                      </div>
                      {user.is_staff && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            <button 
              onClick={() => toast.info("Create Campaign - Coming soon")}
              className="text-left px-4 py-3 rounded-md border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Create Campaign</div>
              <div className="text-sm text-muted-foreground">
                Start a new fundraising campaign
              </div>
            </button>
            <button 
              onClick={() => toast.info("Invite Users - Coming soon")}
              className="text-left px-4 py-3 rounded-md border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Invite Users</div>
              <div className="text-sm text-muted-foreground">
                Send invitations to team members
              </div>
            </button>
            <button 
              onClick={() => toast.info("Reports - Coming soon")}
              className="text-left px-4 py-3 rounded-md border hover:bg-accent transition-colors"
            >
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-muted-foreground">
                Generate analytics reports
              </div>
            </button>
            <button 
              onClick={() => toast.info("Promote Actions - Coming soon")}
              className="text-left px-4 py-3 rounded-md border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Promote Actions</div>
              <div className="text-sm text-muted-foreground">
                Create bonus point opportunities
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
