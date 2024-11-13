"use client";

import { useState, useCallback } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPhotoGrid } from "@/components/admin-photo-grid";
import { usePhotoStore } from "@/hooks/use-photos";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { photos, addPhoto } = usePhotoStore();
  const { toast } = useToast();

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            variant: "destructive",
          });
          continue;
        }

        // Create object URL and get image dimensions
        const url = URL.createObjectURL(file);
        const img = new Image();
        
        try {
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });

          // Create new photo object
          const newPhoto = {
            id: `photo-${Date.now()}-${i}`,
            url,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            description: "",
            downloadCount: 0,
            likes: 0,
            uploadedAt: new Date().toISOString().split('T')[0],
            aspectRatio: img.width > img.height ? 'landscape' : 'portrait',
          };

          // Add photo to store
          addPhoto(newPhoto);
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error);
          URL.revokeObjectURL(url);
          toast({
            title: "Error",
            description: `Failed to process ${file.name}. Please try again.`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Success",
        description: `Uploaded ${files.length} photos successfully.`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button asChild>
            <Link href="/">View Public Gallery</Link>
          </Button>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload Photos</TabsTrigger>
            <TabsTrigger value="manage">Manage Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="p-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <ImagePlus className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-lg font-medium">
                      Drag and drop your photos here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to select files
                    </p>
                  </div>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                    <Button
                      variant="outline"
                      disabled={isUploading}
                      className="mt-2"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploading ? "Uploading..." : "Select Files"}
                    </Button>
                  </label>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Manage Photos</h2>
              <AdminPhotoGrid photos={photos} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}