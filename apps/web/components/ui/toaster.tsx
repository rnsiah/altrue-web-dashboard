"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import { useEffect } from "react";
import { useDonationNotifications } from "@/components/websocket-provider";
import { Heart, User, DollarSign } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "var(--background)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        },
      }}
    />
  );
}

// Real-time donation notifications
export function DonationNotificationListener() {
  useDonationNotifications((donation) => {
    toast.success(
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500" />
        <span>New Donation!</span>
      </div>,
      {
        description: (
          <div className="mt-1">
            <p className="font-medium">${donation.amount} to {donation.nonprofit_name}</p>
            {donation.message && (
              <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                "{donation.message}"
              </p>
            )}
          </div>
        ),
        duration: 5000,
        action: {
          label: "View",
          onClick: () => window.location.href = "/dashboard/donations",
        },
      }
    );
  });

  return null;
}

// User activity notifications
export function UserActivityNotifications() {
  useEffect(() => {
    // Simulate user activity notifications (in production, this would come from WebSocket)
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        toast.info(
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span>New User Joined</span>
          </div>,
          {
            description: "A new user just signed up",
            duration: 3000,
          }
        );
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}

// Export toast helper
export { toast };

// Predefined toast templates
export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, { description });
};

export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, { description });
};

export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, { description });
};

export const showDonationToast = (amount: number, nonprofit: string) => {
  toast.success(
    <div className="flex items-center gap-2">
      <DollarSign className="w-4 h-4 text-green-500" />
      <span>Donation Received!</span>
    </div>,
    {
      description: `${amount} donated to ${nonprofit}`,
      duration: 4000,
    }
  );
};
