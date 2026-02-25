"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Loader2, TrendingUp, Users, DollarSign } from "lucide-react";
import { apiClient } from "@/lib/api";

interface CompanyMatch {
  id: number;
  company_name: string;
  company_logo?: string;
  nonprofit_name: string;
  match_level: number;
  total_raised: number;
  funding_limit: number;
}

export function CompanyMatchingCard() {
  const [matches, setMatches] = useState<CompanyMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalMatched: 0,
    activeMatches: 0,
  });

  useEffect(() => {
    async function fetchMatches() {
      try {
        // Fetch companies and their campaigns from backend
        const companiesData = await apiClient("/companies/").catch(() => ({ results: [] }));
        const companies = companiesData.results || companiesData || [];
        
        // Fetch campaigns for active matching data
        const campaignsData = await apiClient("/campaigns/").catch(() => ({ results: [] }));
        const campaigns = campaignsData.results || campaignsData || [];
        
        // Transform data to match interface
        const transformedMatches: CompanyMatch[] = campaigns
          .filter((c: any) => c.status === 'active')
          .slice(0, 5)
          .map((campaign: any) => ({
            id: campaign.id,
            company_name: campaign.company?.name || 'Unknown Company',
            company_logo: campaign.company?.logo,
            nonprofit_name: campaign.eligible_nonprofits?.[0]?.name || 'Multiple Nonprofits',
            match_level: Math.round(campaign.match_multiplier * 100),
            total_raised: campaign.amount_matched || 0,
            funding_limit: campaign.budget_cap || 0,
          }));
        
        setMatches(transformedMatches);
        
        setStats({
          totalCompanies: companies.length,
          totalMatched: campaigns.reduce((sum: number, c: any) => sum + (c.amount_matched || 0), 0),
          activeMatches: campaigns.filter((c: any) => c.status === 'active').length,
        });
      } catch (error) {
        console.error("Failed to fetch company matches:", error);
        // Use mock data as fallback
        setMatches([
          { id: 1, company_name: "Acme Corp", nonprofit_name: "Red Cross", match_level: 50, total_raised: 15000, funding_limit: 50000 },
          { id: 2, company_name: "Tech Giants", nonprofit_name: "Save the Children", match_level: 100, total_raised: 25000, funding_limit: 25000 },
          { id: 3, company_name: "Green Energy Co", nonprofit_name: "WWF", match_level: 25, total_raised: 8000, funding_limit: 100000 },
        ]);
        setStats({ totalCompanies: 3, totalMatched: 48000, activeMatches: 2 });
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const getProgressPercentage = (raised: number, limit: number) => {
    return Math.min((raised / limit) * 100, 100);
  };

  return (
    <Card className="h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#D4AF37]" />
          Company Matching
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="text-lg font-bold text-[#D4AF37]">{stats.totalCompanies}</p>
            <p className="text-xs text-muted-foreground">Companies</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="text-lg font-bold text-green-600">${(stats.totalMatched / 1000).toFixed(0)}k</p>
            <p className="text-xs text-muted-foreground">Matched</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{stats.activeMatches}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto h-[240px]">
            {matches.map((match) => (
              <div
                key={match.id}
                className="p-3 rounded-lg bg-muted/50 border border-transparent hover:border-[#D4AF37]/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{match.company_name}</p>
                      <p className="text-xs text-muted-foreground">{match.nonprofit_name}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium rounded-full">
                    {match.match_level}% match
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      ${match.total_raised.toLocaleString()} raised
                    </span>
                    <span className="text-muted-foreground">
                      ${match.funding_limit.toLocaleString()} limit
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 transition-all duration-500"
                      style={{ width: `${getProgressPercentage(match.total_raised, match.funding_limit)}%` }}
                    />
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
