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
import {
  Plus,
  Edit,
  Trash2,
  Flag,
  AlertTriangle,
  Globe,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface Cause {
  id: number;
  name: string;
  description: string;
  icon?: string;
  nonprofit_count: number;
  is_active: boolean;
}

interface Atrocity {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  is_active: boolean;
  nonprofits: string[];
}

export default function CausesPage() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [atrocities, setAtrocities] = useState<Atrocity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [causesData, atrocitiesData] = await Promise.all([
        apiClient("/categories/").catch(() => []),
        apiClient("/atrocities/").catch(() => []),
      ]);
      // Handle API response format - ensure we have arrays
      const causesArray = Array.isArray(causesData) ? causesData : causesData?.results || [];
      const atrocitiesArray = Array.isArray(atrocitiesData) ? atrocitiesData : atrocitiesData?.results || [];
      
      // Transform atrocities data to ensure nonprofits is an array of strings
      const transformedAtrocities = atrocitiesArray.map((a: any) => ({
        ...a,
        // If nonprofits contains objects, extract the name, otherwise keep as is
        nonprofits: Array.isArray(a.nonprofits) 
          ? a.nonprofits.map((n: any) => typeof n === 'string' ? n : n?.name || 'Unknown')
          : [],
      }));
      
      setCauses(causesArray);
      setAtrocities(transformedAtrocities);
    } catch (error) {
      setCauses([
        { id: 1, name: "Education", description: "Access to quality education", nonprofit_count: 12, is_active: true },
        { id: 2, name: "Health", description: "Healthcare and medical support", nonprofit_count: 8, is_active: true },
        { id: 3, name: "Environment", description: "Environmental conservation", nonprofit_count: 15, is_active: true },
      ]);
      setAtrocities([
        { id: 1, title: "Children's Hunger", description: "Childhood malnutrition crisis", category: "Health", is_active: true, nonprofits: ["Save the Children", "UNICEF"] },
        { id: 2, title: "Clean Water Access", description: "Lack of clean drinking water", category: "Environment", is_active: true, nonprofits: ["Water.org", "charity: water"] },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Causes & Atrocities</h1>
          <p className="text-muted-foreground">Manage categories and global causes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Cause
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Atrocity
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Causes (Categories)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Nonprofits</TableHead>
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
                  causes.map((cause) => (
                    <TableRow key={cause.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cause.name}</p>
                          <p className="text-sm text-muted-foreground">{cause.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{cause.nonprofit_count}</TableCell>
                      <TableCell>
                        <Badge className={cause.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {cause.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
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
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Atrocities (Global Issues)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
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
                  atrocities.map((atrocity) => (
                    <TableRow key={atrocity.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{atrocity.title}</p>
                          <p className="text-sm text-muted-foreground">{atrocity.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{atrocity.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={atrocity.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {atrocity.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
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
