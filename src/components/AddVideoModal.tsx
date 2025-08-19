import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon } from "lucide-react";

interface AddVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (videoData: VideoFormData) => void;
}

export interface VideoFormData {
  title: string;
  description: string;
  type: 'file' | 'url';
  file?: File;
  url?: string;
}

export const AddVideoModal = ({ open, onOpenChange, onSave }: AddVideoModalProps) => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    type: 'url'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSave = () => {
    if (!formData.title.trim()) return;
    
    if (formData.type === 'file' && !selectedFile) return;
    if (formData.type === 'url' && !formData.url?.trim()) return;

    onSave({
      ...formData,
      file: selectedFile || undefined
    });
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'url'
    });
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, type: 'file' }));
    }
  };

  const isValid = formData.title.trim() && 
    ((formData.type === 'file' && selectedFile) || 
     (formData.type === 'url' && formData.url?.trim()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Training Video</DialogTitle>
          <DialogDescription>
            Upload a video file or provide a YouTube/Google Drive URL to add new training content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter video title..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter video description..."
              rows={3}
            />
          </div>

          {/* Video Source */}
          <div className="space-y-3">
            <Label>Video Source</Label>
            <Tabs 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'file' | 'url' }))}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  File Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2 mt-4">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={formData.url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                />
                <p className="text-xs text-muted-foreground">
                  Supports YouTube and Google Drive video links
                </p>
              </TabsContent>

              <TabsContent value="file" className="space-y-2 mt-4">
                <Label htmlFor="videoFile">Upload Video File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};