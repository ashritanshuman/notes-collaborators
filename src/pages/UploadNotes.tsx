import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const UploadNotes = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      toast({
        title: "Success!",
        description: "Your notes have been uploaded successfully.",
      });
    }, 2000);
  };

  const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const subjects = [
    "Data Structures",
    "Operating Systems",
    "DBMS",
    "Computer Networks",
    "Digital Electronics",
    "Thermodynamics",
  ];
  const tags = ["Notes", "PYQ", "Assignments", "Books", "Lab Manual"];

  if (uploadSuccess) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <PageTransition>
        <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-20">
          <div className="glass-intense rounded-2xl p-12 text-center max-w-2xl animate-fade-in hover-lift">
            <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-3xl font-bold gradient-text mb-4">Upload Successful!</h2>
            <p className="text-muted-foreground mb-8">
              Your notes have been uploaded and will be available to students after review.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setUploadSuccess(false)}>
                Upload More
              </Button>
              <Button variant="glass" onClick={() => window.location.href = "/browse"}>
                Browse Notes
              </Button>
            </div>
          </div>
        </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <PageTransition>
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <RevealOnScroll className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 tracking-tight">Upload Notes</h1>
            <p className="text-muted-foreground text-lg">
              Share your study materials with the community
            </p>
          </RevealOnScroll>

          {/* Upload Form */}
          <RevealOnScroll delay={0.1}>
          <form onSubmit={handleSubmit} className="glass-intense rounded-2xl p-8 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Note Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Data Structures Complete Notes"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the content..."
                rows={4}
              />
            </div>

            {/* Branch and Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select required>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select required>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select required>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Select>
                <SelectTrigger id="tags">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload File *</Label>
              <div className="glass border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
                <label htmlFor="file" className="cursor-pointer">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PPT, DOCX, or Images (max 25MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Notes
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By uploading, you agree to our terms and confirm that you have the right to share this content.
            </p>
          </form>
          </RevealOnScroll>
        </div>
      </div>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default UploadNotes;
