import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link as LinkIcon, Sparkles, Loader2, Image as ImageIcon, Trash2, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImageManager({ onInsert, onSetFeaturedImage, mode = "insert" }) {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      const url = response.file_url;
      
      if (mode === "featured") {
        onSetFeaturedImage(url);
      } else {
        onInsert(url);
      }
      setImageUrl(url);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlInsert = () => {
    if (!imageUrl.trim()) return;
    
    if (mode === "featured") {
      onSetFeaturedImage(imageUrl);
    } else {
      onInsert(imageUrl);
    }
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) return;

    setGenerating(true);
    try {
      const response = await base44.integrations.Core.GenerateImage({
        prompt: `${aiPrompt}. Style: elegant, professional, minimalist, warm tones, high quality`,
      });
      
      setGeneratedImageUrl(response.url);
      if (mode === "featured") {
        onSetFeaturedImage(response.url);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="upload">
          <Upload size={14} className="mr-2" />
          Upload
        </TabsTrigger>
        <TabsTrigger value="url">
          <LinkIcon size={14} className="mr-2" />
          URL
        </TabsTrigger>
        <TabsTrigger value="ai">
          <Sparkles size={14} className="mr-2" />
          AI Generate
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-4">
        <div>
          <Label className="mb-2 block">Upload Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-[#2B2725] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#1E3A32] file:text-white hover:file:bg-[#2B2725] file:cursor-pointer"
          />
        </div>
        {uploading && (
          <div className="flex items-center gap-2 text-[#2B2725]/60">
            <Loader2 size={16} className="animate-spin" />
            Uploading...
          </div>
        )}
        {imageUrl && !uploading && (
          <div className="border border-[#D8B46B]/30 rounded p-3">
            <img src={imageUrl} alt="Uploaded" className="w-full rounded mb-2" />
            <p className="text-xs text-[#2B2725]/60 break-all mb-2">{imageUrl}</p>
            <button
              onClick={() => setImageUrl("")}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <Trash2 size={12} /> Remove & upload a different image
            </button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="url" className="space-y-4">
        <div>
          <Label className="mb-2 block">Image URL</Label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <Button onClick={handleUrlInsert} disabled={!imageUrl.trim()} className="w-full">
          <ImageIcon size={16} className="mr-2" />
          {mode === "featured" ? "Set as Featured Image" : "Insert Image"}
        </Button>
        {imageUrl && (
          <div className="border border-[#D8B46B]/30 rounded p-3">
            <img src={imageUrl} alt="Preview" className="w-full rounded mb-2" />
            <button
              onClick={() => setImageUrl("")}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <Trash2 size={12} /> Clear URL
            </button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="ai" className="space-y-4">
        <div>
          <Label className="mb-2 block">Describe the image you want</Label>
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="E.g., A serene illustration of a person meditating in a minimalist room..."
            rows={3}
          />
          <p className="text-xs text-[#2B2725]/60 mt-1">
            Be descriptive - style, colors, mood, and subject matter
          </p>
        </div>
        <Button
          onClick={handleGenerateImage}
          disabled={!aiPrompt.trim() || generating}
          className="w-full bg-[#6E4F7D] hover:bg-[#5A3F67]"
        >
          {generating ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Generate Image
            </>
          )}
        </Button>
        {generatedImageUrl && (
          <div className="border border-[#D8B46B]/30 rounded p-3">
            <img src={generatedImageUrl} alt="Generated" className="w-full rounded mb-2" />
            {mode !== "featured" && (
              <Button onClick={() => onInsert(generatedImageUrl)} className="w-full mt-2">
                Insert into Post
              </Button>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}