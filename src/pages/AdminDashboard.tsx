import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Download, XCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

type NoteRow = {
  id: string; title: string; subject: string; branch: string; semester: string;
  file_type: string; downloads: number; created_at: string; user_id: string; file_path: string;
  profiles: { display_name: string | null } | null;
};

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [loading, user, navigate]);

  const fetchAll = async () => {
    const [{ data: n }, { count }] = await Promise.all([
      supabase.from("notes").select("*, profiles(display_name)").order("created_at", { ascending: false }).limit(100),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);
    const list = (n as unknown as NoteRow[]) ?? [];
    setNotes(list);
    setUserCount(count ?? 0);
    setTotalDownloads(list.reduce((s, x) => s + x.downloads, 0));
  };

  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin]);

  const handleDelete = async (note: NoteRow) => {
    if (!confirm(`Delete "${note.title}"? This cannot be undone.`)) return;
    const { error: dbErr } = await supabase.from("notes").delete().eq("id", note.id);
    if (dbErr) { toast({ title: "Delete failed", description: dbErr.message, variant: "destructive" }); return; }
    await supabase.storage.from("notes").remove([note.file_path]);
    toast({ title: "Note deleted" });
    fetchAll();
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-20">
          <div className="glass-intense rounded-2xl p-12 text-center max-w-xl">
            <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-3">Admin access required</h2>
            <p className="text-muted-foreground">Your account doesn't have admin privileges.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: "Total Notes", value: notes.length, icon: FileText },
    { label: "Total Users", value: userCount, icon: Users },
    { label: "Total Downloads", value: totalDownloads, icon: Download },
  ];

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage notes and platform analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10"><s.icon className="h-5 w-5 text-primary" /></div>
              </div>
              <p className="text-3xl font-bold mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-6">Recent Uploads</h2>
          {notes.length === 0 ? (
            <p className="text-muted-foreground">No uploads yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <div key={n.id} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/40">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{n.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {n.profiles?.display_name || "Anonymous"} • {n.branch} • Sem {n.semester} • {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="outline">{n.file_type}</Badge>
                  <Badge variant="secondary">{n.downloads} dl</Badge>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(n)}>
                    <XCircle className="h-4 w-4 mr-1" />Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;