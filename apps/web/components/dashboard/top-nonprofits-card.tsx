"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Loader2, Star, TrendingUp, Users, DollarSign } from "lucide-react";
import { apiClient } from "@/lib/api";

interface Nonprofit {
  id: number;
  name: string;
  logo?: string;
  total_balance: number;
  no_of_ratings: number;
  average_rating: number;
  projects_count: number;
  contributors_count: number;
}

export function TopNonprofitsCard() {
  const [nonprofits, setNonprofits] = useState<Nonprofit[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"balance" | "rating" | "contributors">("balance");

  useEffect(() => {
    async function fetchNonprofits() {
      try {
        const data = await apiClient("/nonprofits/");
        const npList = (data.results || data || []).slice(0, 5);
        
        // Sort based on selected criteria
        const sorted = [...npList].sort((a: Nonprofit, b: Nonprofit) => {
          if (sortBy === "balance") return b.total_balance - a.total_balance;
          if (sortBy === "rating") return b.average_rating - a.average_rating;
          if (sortBy === "contributors") return b.contributors_count - a.contributors_count;
          return 0;
        });
        
        setNonprofits(sorted);
      } catch (error) {
        console.error("Failed to fetch nonprofits:", error);
        // Mock data
        setNonprofits([
          { id: 1, name: "Red Cross", total_balance: 125000, no_of_ratings: 45, average_rating: 4.8, projects_count: 12, contributors_count: 850 },
          { id: 2, name: "Save the Children", total_balance: 98000, no_of_ratings: 38, average_rating: 4.7, projects_count: 8, contributors_count: 620 },
          { id: 3, name: "WWF", total_balance: 87000, no_of_ratings: 52, average_rating: 4.9, projects_count: 15, contributors_count: 780 },
          { id: 4, name: "UNICEF", total_balance: 156000, no_of_ratings: 67, average_rating: 4.6, projects_count: 20, contributors_count: 1200 },
          { id: 5, name: "Doctors Without Borders", total_balance: 195000, no_of_ratings: 41, average_rating: 4.9, projects_count: 10, contributors_count: 950 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchNonprofits();
  }, [sortBy]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          Top Nonprofits
        </CardTitle>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-xs border rounded px-2 py-1 bg-background"
        >
          <option value="balance">By Donations</option>
          <option value="rating">By Rating</option>
          <option value="contributors">By Supporters</option>
        </select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[320px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto h-[320px]">
            {nonprofits.map((np, index) => (
              <div
                key={np.id}
                className="p-3 rounded-lg bg-muted/50 border border-transparent hover:border-[#D4AF37]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {np.logo ? (
                      <img src={np.logo} alt={np.name} className="w-full h-full object-cover" />
                    ) : (
                      <Heart className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{np.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {renderStars(np.average_rating || 0)}
                      <span className="text-xs text-muted-foreground">
                        ({np.no_of_ratings || 0})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-1.5 bg-background rounded">
                    <p className="text-sm font-semibold text-green-600">
                      ${(np.total_balance / 1000).toFixed(0)}k
                    </p>
                    <p className="text-[10px] text-muted-foreground">Raised</p>
                  </div>
                  <div className="p-1.5 bg-background rounded">
                    <p className="text-sm font-semibold text-blue-600">
                      {np.projects_count || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Projects</p>
                  </div>
                  <div className="p-1.5 bg-background rounded">
                    <p className="text-sm font-semibold text-purple-600">
                      {np.contributors_count || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Supporters</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
