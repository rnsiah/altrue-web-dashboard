"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Trophy,
  Star,
  Zap,
  Calendar,
  Target,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface RewardAction {
  id: number;
  name: string;
  description: string;
  points_awarded: number;
  is_promoted: boolean;
  promotion_multiplier?: number;
  action_code: string;
  is_completed?: boolean;
}

interface Level {
  id: number;
  name: string;
  level_number: number;
  minimum_points: number;
  maximum_points: number;
}

export default function RewardsPage() {
  const [actions, setActions] = useState<RewardAction[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<RewardAction | null>(null);

  useEffect(() => {
    fetchRewardsData();
  }, []);

  async function fetchRewardsData() {
    try {
      setLoading(true);
      const [actionsData, levelsData] = await Promise.all([
        apiClient("/altrueactions/").catch(() => []),
        apiClient("/levels/").catch(() => []),
      ]);
      setActions(actionsData || []);
      setLevels(levelsData || []);
    } catch (error) {
      setActions([
        { id: 1, name: "First Donation", description: "Make your first donation", points_awarded: 100, is_promoted: false, action_code: "FIRST_DONATION" },
        { id: 2, name: "Share on Social", description: "Share a nonprofit on social media", points_awarded: 50, is_promoted: true, promotion_multiplier: 2, action_code: "SHARE_SOCIAL" },
        { id: 3, name: "Invite Friend", description: "Invite a friend who joins", points_awarded: 200, is_promoted: false, action_code: "INVITE_FRIEND" },
      ]);
      setLevels([
        { id: 1, name: "Beginner", level_number: 1, minimum_points: 0, maximum_points: 499 },
        { id: 2, name: "Helper", level_number: 2, minimum_points: 500, maximum_points: 1499 },
        { id: 3, name: "Giver", level_number: 3, minimum_points: 1500, maximum_points: 4999 },
        { id: 4, name: "Champion", level_number: 4, minimum_points: 5000, maximum_points: 9999 },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards System</h1>
          <p className="text-muted-foreground">Manage points, levels, and actions</p>
        </div>
        <Button onClick={() => setIsActionModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Action
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promoted</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {actions.filter((a) => a.is_promoted).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Levels</CardTitle>
            <Trophy className="w-4 h-4 text-[#D4AF37]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#D4AF37]">{levels.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Altrue Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : (
                  actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{action.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-[#D4AF37]" />
                          <span className="font-medium">{action.points_awarded}</span>
                          {action.promotion_multiplier && (
                            <Badge className="bg-yellow-100 text-yellow-700 ml-2">
                              x{action.promotion_multiplier}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {action.is_promoted ? (
                          <Badge className="bg-green-100 text-green-700">
                            <Star className="w-3 h-3 mr-1" />
                            Promoted
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Standard</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Levels</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Points Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : (
                  levels.map((level) => (
                    <TableRow key={level.id}>
                      <TableCell>
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                          <span className="text-[#D4AF37] font-bold">{level.level_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{level.name}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {level.minimum_points.toLocaleString()} - {level.maximum_points.toLocaleString()} pts
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
