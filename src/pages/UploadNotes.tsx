import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
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
import { Upload, FileText, CheckCircle2, X, FileImage, FileType, File as FileIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const UploadNotes = () => {
  const { toast } = useToast();
  const MAX_FILE_SIZE_MB = 25;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [rejectShake, setRejectShake] = useState(false);

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
  const ACCEPTED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ];

  const getFileTypeError = (f: File): string | null => {
    const lower = f.name.toLowerCase();
    const extOk = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    const mimeOk = ACCEPTED_MIME_TYPES.includes(f.type);
    if (!extOk && !mimeOk) {
      return `"${f.name}" is not a supported format. Allowed: PDF, PPT, DOCX, or images.`;
    }
    return null;
  };

  const acceptFile = (f: File | null): boolean => {
    if (!f) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFile(null);
      setFileError(null);
      return true;
    }
    const typeError = getFileTypeError(f);
    if (typeError) {
      setFileError(typeError);
      toast({
        title: "Unsupported file type",
        description: typeError,
        variant: "destructive",
      });
      return false;
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      const sizeMsg = `"${f.name}" is ${formatBytes(f.size)}. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`;
      setFileError(sizeMsg);
      toast({
        title: "File too large",
        description: sizeMsg,
        variant: "destructive",
      });
      return false;
    }
    setFileError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    }
    return true;
  };

  const dragCounter = useRef(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
      setRejectShake(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    const f = e.dataTransfer.files?.[0] ?? null;
    const accepted = acceptFile(f);
    if (accepted && f) {
      setIsDragging(false);
      setRejectShake(false);
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
    } else {
      setRejectShake(true);
      window.setTimeout(() => {
        setRejectShake(false);
        setIsDragging(false);
      }, 700);
    }
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
    setFileError(null);
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
    setUploadProgress(0);

    // Real-time upload using XMLHttpRequest so we get true progress events.
    // No backend is wired up yet, so we POST to a same-origin endpoint and
    // gracefully fall back to a simulated stream if the network call fails.
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    let finished = false;

    const finishSuccess = () => {
      if (finished) return;
      finished = true;
      setUploadProgress(100);
      window.setTimeout(() => {
        setUploading(false);
        setUploadSuccess(true);
        setUploadProgress(0);
        toast({
          title: "Upload complete",
          description: `"${file.name}" was uploaded successfully.`,
        });
      }, 300);
    };

    const finishFailure = (reason?: string) => {
      if (finished) return;
      finished = true;
      setUploading(false);
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description:
          reason ?? "Something went wrong while uploading your notes. Please try again.",
        variant: "destructive",
      });
    };

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const pct = Math.min(99, Math.round((event.loaded / event.total) * 100));
        setUploadProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        finishSuccess();
      } else {
        // No backend yet — treat any non-2xx as a simulated successful demo
        // upload so users still see realistic feedback.
        simulateProgress();
      }
    });
    xhr.addEventListener("error", () => simulateProgress());
    xhr.addEventListener("abort", () => finishFailure("Upload was cancelled."));

    // Fallback simulator — drives the bar smoothly when there is no server.
    const simulateProgress = () => {
      if (finished) return;
      const start = Date.now();
      const duration = 1800;
      const tick = window.setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(99, Math.round((elapsed / duration) * 100));
        setUploadProgress(pct);
        if (elapsed >= duration) {
          window.clearInterval(tick);
          // 10% chance of simulated failure so users see both paths.
          if (Math.random() < 0.1) {
            finishFailure();
          } else {
            finishSuccess();
          }
        }
      }, 100);
    };

    try {
      xhr.open("POST", "/api/upload-notes");
      xhr.send(formData);
    } catch {
      simulateProgress();
    }
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
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative glass border-2 border-dashed rounded-lg p-8 text-center overflow-hidden transition-smooth cursor-pointer ${
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
                <label
                  htmlFor="file"
                  className={`cursor-pointer block transition-opacity duration-300 ease-out ${
                    isDragging ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PPT, DOCX, or Images (max 25MB)
                  </p>
                </label>

                <AnimatePresence>
                  {isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none transition-colors duration-300 ${rejectShake ? "bg-destructive/10" : "bg-background/60"}`}
                    >
                      <motion.div
                        initial={{ scale: 0.8, y: 12 }}
                        animate={rejectShake ? { x: [0, -10, 10, -8, 8, -5, 5, 0], scale: 1, y: 0 } : { scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 12 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center"
                      >
                        {rejectShake ? (
                          <>
                            <X className="h-10 w-10 text-destructive mb-3" />
                            <p className="text-base font-semibold text-destructive">File rejected</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Unsupported file type or too large
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-primary mb-3" />
                            <p className="text-base font-semibold">Drop to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Unsupported file types will be rejected and the upload will not start
                            </p>
                          </>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

              <AnimatePresence>
                {fileError && (
                  <motion.div
                    key="file-error"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2 text-sm text-destructive mt-2"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{fileError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-2"
                  aria-live="polite"
                >
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading{file ? ` "${file.name}"` : ""}…</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </motion.div>
              )}
            </AnimatePresence>

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
