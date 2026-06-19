import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

type Profile = { display_name: string | null; branch: string | null; year: string | null };
type NoteRow = { id: string; title: string; subject: string; branch: string; semester: string; file_type: string; downloads: number; created_at: string };

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myUploads, setMyUploads] = useState<NoteRow[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: n }] = await Promise.all([
        supabase.from("profiles").select("display_name, branch, year").eq("id", user.id).maybeSingle(),
        supabase.from("notes").select("id, title, subject, branch, semester, file_type, downloads, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(p as Profile);
      setMyUploads((n as NoteRow[]) ?? []);
    })();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col gradient-subtle">
        <Header />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading…</div>
        <Footer />
      </div>
    );
  }

  const initials = (profile?.display_name || user.email || "?").charAt(0).toUpperCase();
  const totalDownloads = myUploads.reduce((sum, n) => sum + n.downloads, 0);

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />
      <PageTransition>
        <div className="flex-1 container mx-auto px-4 py-8">
          <RevealOnScroll>
            <div className="glass-intense rounded-2xl p-8 mb-8 hover-lift">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg">
                  {initials}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2 tracking-tight">{profile?.display_name || "Student"}</h1>
                  <p className="text-muted-foreground mb-4">{user.email}</p>
                  {(profile?.branch || profile?.year) && (
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full glass">
                        <User className="h-4 w-4" />
                        <span>{[profile?.branch, profile?.year].filter(Boolean).join(" • ")}</span>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/upload">
                  <Button className="gradient-primary"><Upload className="h-4 w-4 mr-2" />Upload Notes</Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/50">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold gradient-text">{myUploads.length}</p>
                  <p className="text-sm text-muted-foreground">Uploads</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold gradient-text">{totalDownloads}</p>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <h2 className="text-2xl font-bold text-foreground mb-4">My Uploads ({myUploads.length})</h2>
          {myUploads.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't uploaded any notes yet.</p>
              <Link to="/upload"><Button>Upload your first note</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myUploads.map((n, i) => (
                <RevealOnScroll key={n.id} delay={i * 0.05}>
                  <NoteCard
                    id={n.id} title={n.title} subject={n.subject} branch={n.branch} semester={n.semester}
                    uploadedBy="You" uploadDate={formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    likes={0} downloads={n.downloads} fileType={n.file_type}
                  />
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Dashboard;