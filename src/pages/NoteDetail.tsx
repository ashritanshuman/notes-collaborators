import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, User, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type NoteRow = {
  id: string; title: string; description: string | null; subject: string;
  branch: string; semester: string; file_type: string; file_size: number;
  file_url: string; file_path: string; downloads: number; tag: string | null;
  created_at: string; user_id: string;
  profiles: { display_name: string | null } | null;
};

const NoteDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [note, setNote] = useState<NoteRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*, profiles(display_name)")
        .eq("id", id)
        .maybeSingle();
      if (error) toast({ title: "Could not load note", description: error.message, variant: "destructive" });
      setNote(data as unknown as NoteRow);
      setLoading(false);
    })();
  }, [id, toast]);

  const handleDownload = async () => {
    if (!note) return;
    // increment download counter (best-effort)
    await supabase.from("notes").update({ downloads: note.downloads + 1 }).eq("id", note.id);
    setNote({ ...note, downloads: note.downloads + 1 });

    const { data, error } = await supabase.storage
      .from("notes")
      .createSignedUrl(note.file_path, 60, { download: true });
    if (error || !data) {
      toast({ title: "Download failed", description: error?.message, variant: "destructive" });
      return;
    }
    window.location.href = data.signedUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading…</div>
        <Footer />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Note not found.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            {" / "}<Link to="/browse" className="hover:text-primary">Browse</Link>
            {" / "}<span className="text-foreground">{note.title}</span>
          </div>

          <div className="glass-card rounded-xl p-8">
            <div className="flex items-start justify-between mb-4 gap-4">
              <h1 className="text-3xl font-bold text-foreground flex-1">{note.title}</h1>
              <Badge>{note.file_type}</Badge>
            </div>

            {note.description && <p className="text-muted-foreground mb-6">{note.description}</p>}

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{note.branch}</Badge>
              <Badge variant="secondary">Sem {note.semester}</Badge>
              <Badge variant="secondary">{note.subject}</Badge>
              {note.tag && <Badge variant="outline">{note.tag}</Badge>}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
              <div className="flex items-center gap-1"><User className="h-4 w-4" /><span>{note.profiles?.display_name || "Anonymous"}</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span></div>
              <div className="flex items-center gap-1"><FileText className="h-4 w-4" /><span>{(note.file_size / 1024 / 1024).toFixed(2)} MB</span></div>
              <div className="flex items-center gap-1"><Download className="h-4 w-4" /><span>{note.downloads} downloads</span></div>
            </div>

            <Button onClick={handleDownload} size="lg" className="gradient-primary">
              <Download className="h-4 w-4 mr-2" />Download
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NoteDetail;