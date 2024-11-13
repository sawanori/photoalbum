"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePhotoStore } from "@/hooks/use-photos";
import { Heart, Download, User } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

export default function ProfilePage() {
  const { user } = useAuth();
  const { likedPhotos } = usePhotoStore();

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="grid gap-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <AuthButton />
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Heart className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">Liked Photos</h2>
                  <p className="text-muted-foreground">
                    {likedPhotos.size} photos liked
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Download className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">Downloads</h2>
                  <p className="text-muted-foreground">0 photos downloaded</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">Account</h2>
                  <p className="text-muted-foreground">Manage your settings</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline">Update Profile</Button>
                <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}