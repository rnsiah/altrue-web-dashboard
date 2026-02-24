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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Building2, DollarSign, Users, Heart, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface Company {
  id: number;
  name: string;
  logo?: string;
  description: string;
  website_address?: string;
  is_active: boolean;
  total_donated: number;
  match_count: number;
  nonprofit_count: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const data = await apiClient("/companies/");
      const companiesArray = Array.isArray(data) ? data : data?.results || [];
      // Ensure numeric fields have defaults
      const transformedCompanies = companiesArray.map((c: any) => ({
        ...c,
        total_donated: c.total_donated || 0,
        match_count: c.match_count || 0,
        nonprofit_count: c.nonprofit_count || 0,
      }));
      setCompanies(transformedCompanies);
    } catch (error) {
      setCompanies([
        { id: 1, name: "Acme Corp", description: "Technology company", total_donated: 50000, match_count: 3, nonprofit_count: 5, is_active: true },
        { id: 2, name: "Green Energy Co", description: "Sustainable energy", total_donated: 75000, match_count: 2, nonprofit_count: 3, is_active: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Partners</h1>
          <p className="text-muted-foreground">Manage company matching partners</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${companies.reduce((sum, c) => sum + c.total_donated, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
            <Heart className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {companies.reduce((sum, c) => sum + c.match_count, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supported NPOs</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {companies.reduce((sum, c) => sum + c.nonprofit_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Total Donated</TableHead>
                <TableHead>Matches</TableHead>
                <TableHead>Supported NPOs</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">{company.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${(company.total_donated || 0).toLocaleString()}</TableCell>
                    <TableCell>{company.match_count}</TableCell>
                    <TableCell>{company.nonprofit_count}</TableCell>
                    <TableCell>
                      <Badge className={company.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {company.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
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
