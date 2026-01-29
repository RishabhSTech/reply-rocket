import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Copy, RefreshCw, Send, Wand2 } from "lucide-react";

interface EmailComposerProps {
  className?: string;
}

export function EmailComposer({ className }: EmailComposerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setSubject("Quick question about scaling your outbound");
      setBody(
        `Hi {{name}},

Noticed {{company}} just raised Series B—congrats. Scaling sales teams post-funding usually means one thing: more outbound, same headcount.

We help growth-stage teams 3x their qualified meetings without hiring more SDRs. Curious if that's on your radar?

Worth a 15-min chat?`
      );
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border overflow-hidden",
        className
      )}
    >
      <div className="p-5 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Email Composer</h3>
            <p className="text-sm text-muted-foreground">
              Generate personalized outreach in seconds
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Lead Context */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Lead Name</Label>
            <Input
              id="lead-name"
              placeholder="e.g., Sarah Chen"
              className="bg-secondary border-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="e.g., TechCorp"
              className="bg-secondary border-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              placeholder="e.g., VP of Sales"
              className="bg-secondary border-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select defaultValue="professional">
              <SelectTrigger className="bg-secondary border-0">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pain-point">Pain Point / Context</Label>
          <Textarea
            id="pain-point"
            placeholder="e.g., Recently raised Series B, scaling sales team..."
            className="bg-secondary border-0 min-h-[80px] resize-none"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate Email
            </>
          )}
        </Button>

        {/* Generated Email */}
        {(subject || body) && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="subject">Subject Line</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => navigator.clipboard.writeText(subject)}
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </Button>
              </div>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-secondary border-0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="body">Email Body</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => navigator.clipboard.writeText(body)}
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </Button>
              </div>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="bg-secondary border-0 min-h-[180px] resize-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleGenerate}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
              <Button className="flex-1 gap-2">
                <Send className="w-4 h-4" />
                Add to Campaign
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
