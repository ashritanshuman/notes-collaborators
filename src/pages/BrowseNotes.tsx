import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoteCard } from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const BrowseNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [fileType, setFileType] = useState("all");

  // Mock data
  const notes = [
    {
      id: "1",
      title: "Data Structures and Algorithms Complete Notes",
      subject: "Data Structures",
      branch: "CSE",
      semester: "3",
      uploadedBy: "Rahul Sharma",
      uploadDate: "2 days ago",
      likes: 234,
      downloads: 567,
      fileType: "PDF",
    },
    {
      id: "2",
      title: "Operating Systems Comprehensive Guide",
      subject: "Operating Systems",
      branch: "CSE",
      semester: "5",
      uploadedBy: "Priya Patel",
      uploadDate: "1 week ago",
      likes: 189,
      downloads: 423,
      fileType: "PDF",
    },
    {
      id: "3",
      title: "Digital Signal Processing Notes",
      subject: "DSP",
      branch: "ECE",
      semester: "6",
      uploadedBy: "Amit Kumar",
      uploadDate: "3 days ago",
      likes: 156,
      downloads: 389,
      fileType: "PDF",
    },
    {
      id: "4",
      title: "Thermodynamics Handwritten Notes",
      subject: "Thermodynamics",
      branch: "Mechanical",
      semester: "4",
      uploadedBy: "Sneha Reddy",
      uploadDate: "5 days ago",
      likes: 142,
      downloads: 298,
      fileType: "PDF",
    },
    {
      id: "5",
      title: "DBMS Previous Year Questions",
      subject: "Database Management",
      branch: "CSE",
      semester: "5",
      uploadedBy: "Vikram Singh",
      uploadDate: "1 day ago",
      likes: 198,
      downloads: 512,
      fileType: "PDF",
    },
    {
      id: "6",
      title: "Computer Networks Complete Notes",
      subject: "Computer Networks",
      branch: "CSE",
      semester: "6",
      uploadedBy: "Anjali Verma",
      uploadDate: "4 days ago",
      likes: 176,
      downloads: 445,
      fileType: "PDF",
    },
  ];

  const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const fileTypes = ["all", "PDF", "PPT", "DOCX", "Image"];

  return (
    <div className="min-h-screen flex flex-col gradient-subtle">
      <Header />

      <PageTransition>
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <RevealOnScroll className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 tracking-tight">Browse Notes</h1>
          <p className="text-muted-foreground text-lg">
            Search and filter through thousands of study materials
          </p>
        </RevealOnScroll>

        {/* Search and Filters */}
        <RevealOnScroll delay={0.1}>
        <div className="glass-intense rounded-2xl p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search notes by title or keywords..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dsa">Data Structures</SelectItem>
                <SelectItem value="os">Operating Systems</SelectItem>
                <SelectItem value="dbms">DBMS</SelectItem>
                <SelectItem value="cn">Computer Networks</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger>
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                {fileTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(selectedBranch || selectedSemester || selectedSubject) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedBranch && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedBranch("")}>
                  {selectedBranch} ✕
                </Badge>
              )}
              {selectedSemester && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedSemester("")}>
                  Sem {selectedSemester} ✕
                </Badge>
              )}
              {selectedSubject && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedSubject("")}>
                  {selectedSubject} ✕
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedBranch("");
                  setSelectedSemester("");
                  setSelectedSubject("");
                  setFileType("all");
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        </RevealOnScroll>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{notes.length}</span> results
          </p>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, i) => (
            <RevealOnScroll key={note.id} delay={i * 0.05}>
              <NoteCard {...note} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default BrowseNotes;
