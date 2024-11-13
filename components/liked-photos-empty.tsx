import { Heart } from "lucide-react";

export function LikedPhotosEmpty() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <Heart className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No liked photos yet</h2>
      <p className="text-muted-foreground max-w-md">
        When you like photos, they&apos;ll appear here for easy access and downloading.
      </p>
    </div>
  );
}