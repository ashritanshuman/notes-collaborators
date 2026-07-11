import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, X, FileImage, FileType, File as FileIcon, AlertCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
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

const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const subjects = ["Data Structures", "Operating Systems", "DBMS", "Computer Networks", "Digital Electronics", "Thermodynamics"];
const tagOptions = ["Notes", "PYQ", "Assignments", "Books", "Lab Manual"];

const formSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  branch: z.string().min(1, "Branch is required"),
  semester: z.string().min(1, "Semester is required"),
  subject: z.string().min(1, "Subject is required"),
  tag: z.string().optional().or(z.literal("")),
});
type FormValues = z.infer<typeof formSchema>;

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

const getFileTypeError = (f: File): string | null => {
  const lower = f.name.toLowerCase();
  const extOk = ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  const mimeOk = ACCEPTED_MIME_TYPES.includes(f.type);
  if (!extOk && !mimeOk) {
    return `"${f.name}" is not a supported format. Allowed: PDF, PPT, DOCX, or images.`;
  }
  return null;
};

const fileTypeLabel = (f: File): string => {
  const n = f.name.toLowerCase();
  if (n.endsWith(".pdf")) return "PDF";
  if (n.endsWith(".ppt") || n.endsWith(".pptx")) return "PPT";
  if (n.endsWith(".doc") || n.endsWith(".docx")) return "DOCX";
  if (f.type.startsWith("image/")) return "Image";
  return "File";
};

const UploadNotes = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [rejectShake, setRejectShake] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const cancelledRef = useRef(false);
  const dragCounter = useRef(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", branch: "", semester: "", subject: "", tag: "" },
  });

  const acceptFile = (f: File | null): boolean => {
    if (!f) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null); setFile(null); setFileError(null); return true;
    }
    const typeError = getFileTypeError(f);
    if (typeError) {
      setFileError(typeError);
      toast({ title: "Unsupported file type", description: typeError, variant: "destructive" });
      return false;
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      const msg = `"${f.name}" is ${formatBytes(f.size)}. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`;
      setFileError(msg);
      toast({ title: "File too large", description: msg, variant: "destructive" });
      return false;
    }
    setFileError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(f);
    if (f.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(f));
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!acceptFile(f)) e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); dragCounter.current++;
    if (dragCounter.current === 1) { setIsDragging(true); setRejectShake(false); }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); dragCounter.current = 0;
    const f = e.dataTransfer.files?.[0] ?? null;
    const accepted = acceptFile(f);
    if (accepted) {
      setIsDragging(false); setRejectShake(false);
    } else {
      setRejectShake(true);
      window.setTimeout(() => { setRejectShake(false); setIsDragging(false); }, 700);
    }
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null); setFile(null); setFileError(null);
    const input = document.getElementById("file") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need an account to upload notes.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!file) {
      toast({ title: "No file selected", description: "Please choose a file before uploading.", variant: "destructive" });
      return;
    }

    cancelledRef.current = false;
    setUploading(true);
    setUploadProgress(0);

    // Smooth progress simulation since supabase-js doesn't expose upload progress
    const start = Date.now();
    const targetMs = Math.max(1200, Math.min(8000, file.size / 50));
    const tick = window.setInterval(() => {
      const pct = Math.min(95, Math.round(((Date.now() - start) / targetMs) * 95));
      setUploadProgress(pct);
    }, 100);

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("notes")
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });

      if (cancelledRef.current) { window.clearInterval(tick); return; }
      if (uploadError) throw uploadError;

      const { data: signed, error: signedErr } = await supabase.storage
        .from("notes")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signedErr) throw signedErr;

      const { error: insertErr } = await supabase.from("notes").insert({
        user_id: user.id,
        title: values.title.trim(),
        description: values.description?.trim() || null,
        branch: values.branch,
        semester: values.semester,
        subject: values.subject,
        tag: values.tag || null,
        file_path: path,
        file_url: signed.signedUrl,
        file_type: fileTypeLabel(file),
        file_size: file.size,
      });
      if (insertErr) throw insertErr;

      window.clearInterval(tick);
      setUploadProgress(100);
      window.setTimeout(() => {
        setUploading(false);
        setUploadSuccess(true);
        setUploadProgress(0);
        toast({ title: "Upload complete", description: `"${file.name}" was uploaded successfully.` });
      }, 300);
    } catch (err) {
      window.clearInterval(tick);
      setUploading(false);
      setUploadProgress(0);
      if (!cancelledRef.current) {
        toast({
          title: "Upload failed",
          description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => setShowCancelDialog(true);
  const confirmCancel = () => {
    setShowCancelDialog(false);
    cancelledRef.current = true;
    setUploading(false);
    setUploadProgress(0);
    toast({ title: "Upload cancelled" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading…</div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <PageTransition>
          <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-20">
            <div className="glass-intense rounded-2xl p-12 text-center max-w-xl">
              <LogIn className="h-16 w-16 text-foreground mx-auto mb-6" />
              <h2 className="text-3xl font-bold gradient-text mb-3">Sign in to upload</h2>
              <p className="text-muted-foreground mb-8">You need a free account to share notes with the community.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/login")}>Login</Button>
                <Button variant="outline" onClick={() => navigate("/register")}>Create account</Button>
              </div>
            </div>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <PageTransition>
          <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-20">
            <div className="glass-intense rounded-2xl p-12 text-center max-w-2xl animate-fade-in hover-lift">
              <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6 animate-float" />
              <h2 className="text-3xl font-bold gradient-text mb-4">Upload Successful!</h2>
              <p className="text-muted-foreground mb-8">Your notes are now live and available to everyone.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => { setUploadSuccess(false); form.reset(); clearFile(); }}>
                  Upload More
                </Button>
                <Button variant="glass" onClick={() => navigate("/browse")}>Browse Notes</Button>
              </div>
            </div>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  const FileIconCmp = file ? getFileIcon(file) : FileIcon;

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />
      <PageTransition>
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <RevealOnScroll className="mb-8 text-center">
              <span className="eyebrow mb-4">Contribute</span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mt-4 mb-3 tracking-[-0.03em] leading-[1]">
                Upload <span className="gradient-text italic font-light">notes</span>
              </h1>
              <div className="rule-gold w-32 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Share your study materials with the community</p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="glass-intense rounded-2xl p-8 space-y-6">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note Title *</FormLabel>
                      <FormControl><Input placeholder="e.g., Data Structures Complete Notes" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Brief description of the content..." rows={4} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="branch" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="semester" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {semesters.map((s) => <SelectItem key={s} value={s}>Semester {s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="tag" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {tagOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* File dropzone */}
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File *</Label>
                    <div
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative glass border-2 border-dashed rounded-lg p-8 text-center overflow-hidden transition-smooth cursor-pointer ${
                        isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary"
                      }`}
                    >
                      <input type="file" id="file" className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} />
                      <label htmlFor="file" className={`cursor-pointer block transition-opacity duration-300 ease-out ${isDragging ? "opacity-0" : "opacity-100"}`}>
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, PPT, DOCX, or Images (max {MAX_FILE_SIZE_MB}MB)</p>
                      </label>

                      <AnimatePresence>
                        {isDragging && (
                          <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                            className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none transition-colors duration-300 ${rejectShake ? "bg-destructive/10" : "bg-background/60"}`}
                          >
                            <motion.div
                              initial={{ scale: 0.8, y: 12 }}
                              animate={rejectShake ? { x: [0, -10, 10, -8, 8, -5, 5, 0], scale: 1, y: 0 } : { scale: 1, y: 0 }}
                              exit={{ scale: 0.8, y: 12 }} transition={{ duration: 0.3, ease: "easeOut" }}
                              className="flex flex-col items-center"
                            >
                              {rejectShake ? <AlertCircle className="h-10 w-10 text-destructive mb-2" /> : <Upload className="h-10 w-10 text-primary mb-2" />}
                              <p className="font-semibold">{rejectShake ? "Unsupported file" : "Drop to upload"}</p>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {fileError && <p className="text-sm text-destructive">{fileError}</p>}
                  </div>

                  {file && (
                    <div className="glass rounded-lg p-4 flex items-center gap-3">
                      {previewUrl ? (
                        <img src={previewUrl} alt="preview" className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <FileIconCmp className="h-10 w-10 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={clearFile} disabled={uploading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <AnimatePresence>
                    {uploading && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Uploading…</span>
                          <span className="font-semibold">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />Cancel upload
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button type="submit" size="lg" className="w-full gradient-primary" disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading…" : "Upload Notes"}
                  </Button>
                </form>
              </Form>
            </RevealOnScroll>
          </div>
        </div>
      </PageTransition>
      <Footer />

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel upload?</AlertDialogTitle>
            <AlertDialogDescription>Your progress will be lost and the file won't be saved.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep uploading</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UploadNotes;