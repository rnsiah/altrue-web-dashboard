"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Mail,
  Shield,
  CreditCard,
  Save,
  Lock,
  Globe,
} from "lucide-react";
import { toast } from "@/components/ui/toaster";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Altrue Global",
    supportEmail: "support@altrue.global",
    enableNotifications: true,
    enableEmails: true,
    requireApproval: true,
    maintenanceMode: false,
    stripePublishableKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
  });

  function handleSave() {
    toast.success("Settings saved successfully");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration</p>
n      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Platform Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Disable public access</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Approval Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Nonprofit Approval</Label>
                <p className="text-sm text-muted-foreground">New nonprofits need admin approval</p>
              </div>
              <Switch
                checked={settings.requireApproval}
                onCheckedChange={(checked) => setSettings({ ...settings, requireApproval: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email alerts for new submissions</p>
              </div>
              <Switch
                checked={settings.enableEmails}
                onCheckedChange={(checked) => setSettings({ ...settings, enableEmails: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Settings
            </CardTitle>
            <CardDescription>Stripe configuration (read-only in demo)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Publishable Key</Label>
              <Input value={settings.stripePublishableKey} type="password" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Secret Key</Label>
              <Input value={settings.stripeSecretKey} type="password" readOnly />
            </div>
            <Button variant="outline" className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Update Stripe Keys
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable mobile push notifications</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Donation Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify admins of large donations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>New User Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify on new registrations</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
