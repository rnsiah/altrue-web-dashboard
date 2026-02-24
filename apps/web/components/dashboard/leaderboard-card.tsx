"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Loader2, Medal, Crown, Star } from "lucide-react";
import { apiClient } from "@/lib/api";

interface LeaderboardEntry {
  rank: number;
  username: string;
  total_balance: number;
  profile_image?: string;
  altrue_level_number: number;
}

export function LeaderboardCard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await apiClient("/leaderboard/points/");
        setLeaders(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/30";
      case 2:
        return "bg-gray-400/10 border-gray-400/30";
      case 3:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-muted/50";
    }
  };

  return (
    <Card className="h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#D4AF37]" />
          Top Donors (By Points)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[320px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : leaders.length === 0 ? (
          <div className="flex items-center justify-center h-[320px] text-muted-foreground">
            No leaderboard data available
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader) => (
              <div
                key={leader.username}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getRankStyle(leader.rank)} transition-colors hover:opacity-80`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(leader.rank)}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center overflow-hidden">
                  {leader.profile_image ? (
                    <img
                      src={leader.profile_image}
                      alt={leader.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#D4AF37] font-bold">
                      {leader.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{leader.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Level {leader.altrue_level_number}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-[#D4AF37]">
                    {leader.total_balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
