import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoteCard } from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const fileTypes = ["all", "PDF", "PPT", "DOCX", "Image"];

type Note = {
  id: string; title: string; subject: string; branch: string; semester: string;
  file_type: string; downloads: number; created_at: string; user_id: string;
  profiles: { display_name: string | null } | null;
};

const BrowseNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [fileType, setFileType] = useState("all");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("notes")
        .select("id, title, subject, branch, semester, file_type, downloads, created_at, user_id, profiles(display_name)")
        .order("created_at", { ascending: false })
        .limit(200);
      setNotes((data as unknown as Note[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = notes.filter((n) => {
      if (selectedBranch && n.branch !== selectedBranch) return false;
      if (selectedSemester && n.semester !== selectedSemester) return false;
      if (fileType !== "all" && n.file_type !== fileType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!n.title.toLowerCase().includes(q) && !n.subject.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sortBy === "downloads") list = [...list].sort((a, b) => b.downloads - a.downloads);
    return list;
  }, [notes, selectedBranch, selectedSemester, fileType, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />
      <PageTransition>
        <div className="flex-1 container mx-auto px-4 py-8">
          <RevealOnScroll className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 tracking-tight">Browse Notes</h1>
            <p className="text-muted-foreground text-lg">Search and filter through study materials shared by students</p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="glass-intense rounded-2xl p-6 mb-8">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search notes by title or subject..." className="pl-10 h-12" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger><SelectValue placeholder="Branch" /></SelectTrigger>
                  <SelectContent>{branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
                  <SelectContent>{semesters.map((s) => <SelectItem key={s} value={s}>Semester {s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger><SelectValue placeholder="File Type" /></SelectTrigger>
                  <SelectContent>{fileTypes.map((t) => <SelectItem key={t} value={t}>{t === "all" ? "All Types" : t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {(selectedBranch || selectedSemester) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {selectedBranch && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedBranch("")}>{selectedBranch} ✕</Badge>}
                  {selectedSemester && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedSemester("")}>Sem {selectedSemester} ✕</Badge>}
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedBranch(""); setSelectedSemester(""); setFileType("all"); }}>Clear all</Button>
                </div>
              )}
            </div>
          </RevealOnScroll>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> results
            </p>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading notes…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No notes match your filters yet. Be the first to upload!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((n, i) => (
                <RevealOnScroll key={n.id} delay={i * 0.03}>
                  <NoteCard
                    id={n.id}
                    title={n.title}
                    subject={n.subject}
                    branch={n.branch}
                    semester={n.semester}
                    uploadedBy={n.profiles?.display_name || "Anonymous"}
                    uploadDate={formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    likes={0}
                    downloads={n.downloads}
                    fileType={n.file_type}
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

export default BrowseNotes;