import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Upload, Bookmark, Award, Settings } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("uploads");

  // Mock user data
  const user = {
    name: "Rahul Sharma",
    email: "rahul.sharma@student.edu",
    branch: "CSE",
    year: "3rd Year",
    avatar: "RS",
    totalUploads: 12,
    totalLikes: 458,
    totalDownloads: 1234,
    badge: "Gold Contributor",
  };

  // Mock uploaded notes
  const myUploads = [
    {
      id: "1",
      title: "Data Structures and Algorithms Complete Notes",
      subject: "Data Structures",
      branch: "CSE",
      semester: "3",
      uploadedBy: "You",
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
      uploadedBy: "You",
      uploadDate: "1 week ago",
      likes: 189,
      downloads: 423,
      fileType: "PDF",
    },
  ];

  // Mock saved notes
  const savedNotes = [
    {
      id: "3",
      title: "Machine Learning Complete Notes",
      subject: "Machine Learning",
      branch: "CSE",
      semester: "7",
      uploadedBy: "Priya Patel",
      uploadDate: "3 days ago",
      likes: 156,
      downloads: 389,
      fileType: "PDF",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
              {user.avatar}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
                  <User className="h-4 w-4" />
                  <span>{user.branch} • {user.year}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                  <Award className="h-4 w-4" />
                  <span>{user.badge}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{user.totalUploads}</p>
              <p className="text-sm text-muted-foreground">Uploads</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{user.totalLikes}</p>
              <p className="text-sm text-muted-foreground">Likes Received</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{user.totalDownloads}</p>
              <p className="text-sm text-muted-foreground">Downloads</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass mb-8">
            <TabsTrigger value="uploads" className="gap-2">
              <Upload className="h-4 w-4" />
              My Uploads
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Saved Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">My Uploads ({myUploads.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myUploads.map((note) => (
                <NoteCard key={note.id} {...note} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Saved Notes ({savedNotes.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedNotes.map((note) => (
                <NoteCard key={note.id} {...note} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
