"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Heart, DollarSign, Activity } from "lucide-react";
import { useDashboardStats } from "@/components/websocket-provider";

// Colors for charts
const COLORS = ["#D4AF37", "#22c55e", "#3b82f6", "#ef4444", "#8b5cf6"];

interface LiveStatsChartProps {
  data: any[];
  title: string;
  icon: React.ReactNode;
  color?: string;
}

function LiveStatsChart({ data, title, icon, color = "#D4AF37" }: LiveStatsChartProps) {
  return (
    <Card className="h-[300px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </CardHeader>
      <CardContent className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
              labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fillOpacity={1}
              fill={`url(#color${title})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Generate initial mock data
function generateInitialData(points: number = 20) {
  const data = [];
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    data.push({
      time: now - i * 60000,
      value: Math.floor(Math.random() * 50) + 100,
    });
  }
  return data;
}

export function LiveUserChart() {
  const [data, setData] = useState(generateInitialData());
  const { isConnected, liveStats } = useDashboardStats();

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), {
          time: Date.now(),
          value: Math.floor(Math.random() * 20) + (liveStats.activeUsers || 100),
        }];
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [liveStats.activeUsers]);

  return (
    <LiveStatsChart
      data={data}
      title="Active Users"
      icon={<Users className="w-4 h-4" />}
      color="#3b82f6"
    />
  );
}

export function LiveDonationChart() {
  const [data, setData] = useState(generateInitialData());
  const { isConnected } = useDashboardStats();

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newValue = Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 50 : 0;
        const newData = [...prev.slice(1), {
          time: Date.now(),
          value: newValue,
        }];
        return newData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LiveStatsChart
      data={data}
      title="Donations (Last 20 min)"
      icon={<Heart className="w-4 h-4" />}
      color="#22c55e"
    />
  );
}

export function LiveRevenueChart() {
  const [data, setData] = useState(generateInitialData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), {
          time: Date.now(),
          value: Math.floor(Math.random() * 1000) + 2000,
        }];
        return newData;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LiveStatsChart
      data={data}
      title="Revenue ($)"
      icon={<DollarSign className="w-4 h-4" />}
      color="#D4AF37"
    />
  );
}

// Category breakdown pie chart
export function DonationCategoryChart() {
  const data = [
    { name: "Education", value: 35 },
    { name: "Healthcare", value: 25 },
    { name: "Environment", value: 20 },
    { name: "Poverty", value: 15 },
    { name: "Other", value: 5 },
  ];

  return (
    <Card className="h-[300px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Donations by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Real-time activity feed
interface Activity {
  id: number;
  type: string;
  message: string;
  amount?: number;
  user?: string;
  time: number;
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, type: "donation", message: "New donation received", amount: 250, time: Date.now() - 120000 },
    { id: 2, type: "user", message: "New user registered", user: "john.doe@example.com", time: Date.now() - 300000 },
    { id: 3, type: "donation", message: "Donation completed", amount: 100, time: Date.now() - 600000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const isDonation = Math.random() > 0.5;
        const newActivity: Activity = {
          id: Date.now(),
          type: isDonation ? "donation" : "user",
          message: isDonation ? "New donation received" : "New user registered",
          time: Date.now(),
          ...(isDonation ? { amount: Math.floor(Math.random() * 500) + 50 } : { user: `user${Math.floor(Math.random() * 100)}@example.com` }),
        };
        setActivities((prev) => [newActivity, ...prev].slice(0, 10));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Activity
        </CardTitle>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 overflow-y-auto h-[320px]">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-transparent hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === "donation" 
                  ? "bg-green-100 text-green-600" 
                  : "bg-blue-100 text-blue-600"
              }`}>
                {activity.type === "donation" ? (
                  <Heart size={14} />
                ) : (
                  <Users size={14} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                {activity.amount && (
                  <p className="text-sm text-green-600 font-medium">+${activity.amount}</p>
                )}
                {activity.user && (
                  <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.time).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
