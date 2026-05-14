import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { Upload, FileText, CheckCircle2, X, FileImage, FileType, File as FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const UploadNotes = () => {
  const { toast } = useToast();
  const MAX_FILE_SIZE_MB = 25;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (f: File) => {
    if (f.type.startsWith("image/")) return FileImage;
    if (f.type === "application/pdf") return FileType;
    return FileIcon;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!acceptFile(f)) {
      e.target.value = "";
    }
  };

  const ACCEPTED_EXTENSIONS = [".pdf", ".ppt", ".pptx", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

  const acceptFile = (f: File | null): boolean => {
    if (!f) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFile(null);
      return true;
    }
    const lower = f.name.toLowerCase();
    const extOk = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    if (!extOk) {
      toast({
        title: "Unsupported file type",
        description: `"${f.name}" is not a supported format. Allowed: PDF, PPT, DOCX, or images.`,
        variant: "destructive",
      });
      return false;
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: "File too large",
        description: `"${f.name}" is ${formatBytes(f.size)}. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`,
        variant: "destructive",
      });
      return false;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    }
    return true;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (acceptFile(f) && f) {
      const input = document.getElementById("file") as HTMLInputElement | null;
      if (input) {
        try {
          const dt = new DataTransfer();
          dt.items.add(f);
          input.files = dt.files;
        } catch {
          // Some browsers may not allow this; preview still works via state.
        }
      }
    }
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose or drop a file before uploading your notes.",
        variant: "destructive",
      });
      return;
    }
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
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`glass border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-primary"
                }`}
              >
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
                  required
                  onChange={handleFileChange}
                />
                <label htmlFor="file" className="cursor-pointer">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium mb-1">
                    {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PPT, DOCX, or Images (max 25MB)
                  </p>
                </label>
              </div>

              <AnimatePresence>
                {file && (
                  <motion.div
                    key={file.name + file.size}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="glass-intense rounded-lg p-3 flex items-center gap-3 mt-3"
                  >
                    <div className="h-14 w-14 rounded-md overflow-hidden flex items-center justify-center bg-muted/30 border border-border shrink-0">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (() => {
                          const Icon = getFileIcon(file);
                          return <Icon className="h-6 w-6 text-foreground" />;
                        })()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                        {file.type ? ` · ${file.type}` : ""}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                      aria-label="Remove file"
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={uploading || !file}
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
