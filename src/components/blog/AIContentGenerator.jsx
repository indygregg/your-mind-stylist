import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Copy, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIContentGenerator({ onInsert }) {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("paragraph");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const contentTypes = [
    { value: "full", label: "Full Blog Post", prompt: "Write a complete, engaging blog post about: ", fullPost: true },
    { value: "outline", label: "Blog Outline", prompt: "Create a detailed outline for a blog post about: " },
    { value: "title", label: "Title Ideas", prompt: "Generate 5 compelling blog post titles about: " },
    { value: "paragraph", label: "Paragraph", prompt: "Write a compelling blog paragraph about: " },
    { value: "intro", label: "Opening Hook", prompt: "Write an engaging opening paragraph that hooks the reader for a blog post about: " },
    { value: "conclusion", label: "Conclusion", prompt: "Write a powerful conclusion for a blog post about: " },
    { value: "section", label: "Section", prompt: "Write a detailed section for a blog post about: " },
    { value: "list", label: "Bullet List", prompt: "Create a bullet list of key points about: " },
    { value: "story", label: "Story/Example", prompt: "Write a relatable story or example about: " },
    { value: "quote", label: "Pull Quote", prompt: "Create a memorable, quotable statement about: " },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    try {
      const selectedType = contentTypes.find(t => t.value === contentType);
      let fullPrompt = `${selectedType.prompt}${prompt}

Style: Mind Styling voice - calm, intelligent, introspective, identity-focused. Write for emotional intelligence and personal transformation. Keep it grounded, not fluffy.`;

      if (selectedType.fullPost) {
        fullPrompt += `

Include:
- Engaging opening hook
- Clear sections with subheadings
- Practical insights and examples
- Strong conclusion
- Length: 800-1200 words`;
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
      });

      setGeneratedContent(response);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleInsert = () => {
    if (generatedContent) {
      onInsert(generatedContent);
      setGeneratedContent("");
      setPrompt("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">What do you want to write about?</Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., How imposter syndrome affects decision-making..."
          rows={3}
        />
      </div>

      <div>
        <Label className="mb-2 block">Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim() || generating}
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
            Generate Content
          </>
        )}
      </Button>

      {generatedContent && (
        <div className="border border-[#D8B46B]/30 rounded-lg p-4 bg-[#F9F5EF]">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm text-[#2B2725]/60">Generated Content</Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(generatedContent)}
            >
              <Copy size={14} className="mr-1" />
              Copy
            </Button>
          </div>
          <div className="prose prose-sm max-w-none mb-4 text-[#2B2725]">
            {generatedContent}
          </div>
          <Button onClick={handleInsert} className="w-full bg-[#1E3A32]">
            <ArrowRight size={16} className="mr-2" />
            Insert into Editor
          </Button>
        </div>
      )}
    </div>
  );
}