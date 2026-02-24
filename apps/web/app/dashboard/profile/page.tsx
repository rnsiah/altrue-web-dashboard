"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, User } from "lucide-react";
import { getUserProfile, updateUserProfile, getUser, updateUser } from "@/lib/api";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
  });
  
  const [profileData, setProfileData] = useState({
    phone: "",
    city: "",
    address: "",
    zip_code: "",
    bio: "",
  });

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const user = await getUser(session.user.id);
        setUserData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          username: user.username || "",
        });
        
        // Try to get profile
        try {
          const profiles = await getUserProfile(session.user.id);
          if (profiles && profiles.length > 0) {
            const profile = profiles[0];
            setProfileData({
              phone: profile.phone || "",
              city: profile.city || "",
              address: profile.address || "",
              zip_code: profile.zip_code || "",
              bio: profile.bio || "",
            });
          }
        } catch (e) {
          // Profile might not exist yet
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      // Update user data
      await updateUser(session.user.id, {
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
      
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      {error && (
        <div className="text-red-500 p-3 bg-red-50 rounded">{error}</div>
      )}
      
      {success && (
        <div className="text-green-600 p-3 bg-green-50 rounded">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={userData.first_name}
                  onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={userData.last_name}
                  onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={userData.username}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Username cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={userData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Contact admin to change email</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                placeholder="Street address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Zip Code</label>
                <Input
                  value={profileData.zip_code}
                  onChange={(e) => setProfileData({ ...profileData, zip_code: e.target.value })}
                  placeholder="Zip code"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
