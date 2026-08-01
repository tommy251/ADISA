"use client";

import { useState, useEffect } from "react";
import { Card, Button, Text } from "@/components/retroui";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfileAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileSettings() {
  const { user, isLoading, checkAuth, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateProfileAction({
        name: formData.name,
        newEmail: user?.email !== formData.email ? formData.email : undefined,
      });

      if (result.success) {
        toast.success("Profile updated successfully");
        await checkAuth();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="w-full bg-white">
        <div className="p-6 text-center">
          <Text className="mb-4">Please sign in to view your profile</Text>
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <Card className="w-full shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold">
                Name
              </label>
              <div className="relative inline-block w-full">
                <div className="absolute -bottom-1 -right-1 left-1 top-1 border-2 border-black bg-black" />
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-2 border-2 border-black relative bg-white text-base focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="w-full bg-white shadow-none">
        <div className="p-6">
          <Text as="h3" className="text-xl mb-4">
            Account Information
          </Text>
          <div className="space-y-2 text-sm mb-8">
            <div className="flex justify-between py-2 border-b">
              <span className="font-bold">Plan:</span>
              <span className="px-2 py-0.5 bg-primary border border-black text-xs font-bold">
                {user.isPro ? "PRO" : "ESSENTIAL"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-bold">Account Type:</span>
              <span>{user.isOrg ? "Organization" : "Individual"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-bold">Email:</span>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </div>

          <Button onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
