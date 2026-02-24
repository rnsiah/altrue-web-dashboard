"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Play, 
  Square, 
  RotateCcw, 
  Settings, 
  Server,
  Database,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Process {
  id: string;
  name: string;
  description: string;
  status: "running" | "stopped" | "error" | "warning";
  type: "service" | "task" | "queue" | "sync";
  lastRun?: string;
  nextRun?: string;
  uptime?: string;
  errorCount: number;
}

// Mock processes for now - these would come from backend
const mockProcesses: Process[] = [
  {
    id: "1",
    name: "Donation Sync",
    description: "Syncs donation data with Stripe",
    status: "running",
    type: "sync",
    lastRun: "2026-02-21 21:45:00",
    nextRun: "2026-02-21 22:00:00",
    uptime: "3d 4h",
    errorCount: 0,
  },
  {
    id: "2",
    name: "Email Notifications",
    description: "Sends queued email notifications",
    status: "running",
    type: "queue",
    lastRun: "2026-02-21 21:50:00",
    nextRun: "2026-02-21 21:55:00",
    uptime: "5d 12h",
    errorCount: 2,
  },
  {
    id: "3",
    name: "Database Backup",
    description: "Automated daily database backup",
    status: "stopped",
    type: "task",
    lastRun: "2026-02-21 02:00:00",
    nextRun: "2026-02-22 02:00:00",
    errorCount: 0,
  },
  {
    id: "4",
    name: "Points Calculation",
    description: "Calculates user points and levels",
    status: "warning",
    type: "service",
    lastRun: "2026-02-21 21:30:00",
    nextRun: "2026-02-21 22:30:00",
    uptime: "1d 8h",
    errorCount: 5,
  },
  {
    id: "5",
    name: "Report Generation",
    description: "Generates analytics reports",
    status: "error",
    type: "task",
    lastRun: "2026-02-21 20:00:00",
    errorCount: 10,
  },
];

export default function AdminProcessesPage() {
  const { data: session } = useSession();
  const [processes, setProcesses] = useState<Process[]>(mockProcesses);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isAdmin = session?.user?.role === "admin";

  // In the future, this would fetch from backend
  useEffect(() => {
    // fetchProcesses().then(setProcesses)
  }, []);

  async function handleProcessAction(processId: string, action: "start" | "stop" | "restart") {
    setActionLoading(processId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        if (action === "start") return { ...p, status: "running" };
        if (action === "stop") return { ...p, status: "stopped" };
        if (action === "restart") return { ...p, status: "running", errorCount: 0 };
      }
      return p;
    }));
    
    setActionLoading(null);
  }

  function getStatusIcon(status: Process["status"]) {
    switch (status) {
      case "running":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "stopped":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  }

  function getStatusBadge(status: Process["status"]) {
    const styles = {
      running: "bg-green-100 text-green-700",
      stopped: "bg-gray-100 text-gray-700",
      error: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  function getTypeIcon(type: Process["type"]) {
    switch (type) {
      case "service":
        return <Server className="w-4 h-4" />;
      case "task":
        return <Settings className="w-4 h-4" />;
      case "queue":
        return <Database className="w-4 h-4" />;
      case "sync":
        return <RotateCcw className="w-4 h-4" />;
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">Admin privileges required</p>
        </div>
      </div>
    );
  }

  const runningCount = processes.filter(p => p.status === "running").length;
  const errorCount = processes.filter(p => p.status === "error").length;
  const warningCount = processes.filter(p => p.status === "warning").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Process Management</h2>
        <p className="text-muted-foreground">
          Monitor and control system processes and background tasks.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Processes</CardTitle>
            <Activity className="w-4 h-4 text-[#D4AF37]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{runningCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Processes List */}
      <div className="space-y-4">
        {processes.map((process) => (
          <Card key={process.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    {getTypeIcon(process.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{process.name}</h3>
                      {getStatusBadge(process.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {process.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      {process.lastRun && (
                        <span>Last run: {process.lastRun}</span>
                      )}
                      {process.nextRun && (
                        <span>Next run: {process.nextRun}</span>
                      )}
                      {process.uptime && (
                        <span>Uptime: {process.uptime}</span>
                      )}
                      {process.errorCount > 0 && (
                        <span className="text-red-500">
                          Errors: {process.errorCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {process.status === "running" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProcessAction(process.id, "stop")}
                      disabled={actionLoading === process.id}
                    >
                      {actionLoading === process.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Square className="w-4 h-4 mr-1" />
                      )}
                      Stop
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProcessAction(process.id, "start")}
                      disabled={actionLoading === process.id}
                    >
                      {actionLoading === process.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-1" />
                      )}
                      Start
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProcessAction(process.id, "restart")}
                    disabled={actionLoading === process.id}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Restart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
