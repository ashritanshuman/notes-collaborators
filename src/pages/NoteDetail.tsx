import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Download,
  Bookmark,
  Flag,
  User,
  Calendar,
  FileText,
  Send,
} from "lucide-react";

const NoteDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");

  // Mock note data
  const note = {
    id,
    title: "Data Structures and Algorithms Complete Notes",
    subject: "Data Structures",
    branch: "CSE",
    semester: "3",
    uploadedBy: "Rahul Sharma",
    uploadDate: "2 days ago",
    likes: 234,
    downloads: 567,
    fileType: "PDF",
    description:
      "Comprehensive notes covering all topics in Data Structures and Algorithms including Arrays, Linked Lists, Trees, Graphs, Sorting, and Searching algorithms with examples and complexity analysis.",
    tags: ["Notes", "DSA", "Complete"],
  };

  // Mock comments
  const comments = [
    {
      id: "1",
      user: "Priya Patel",
      comment: "Very helpful notes! Thanks for sharing.",
      timestamp: "1 day ago",
    },
    {
      id: "2",
      user: "Amit Kumar",
      comment: "Clear explanations with good examples.",
      timestamp: "2 days ago",
    },
  ];

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission
    setComment("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            {" / "}
            <Link to="/browse" className="hover:text-primary">
              Browse
            </Link>
            {" / "}
            <span className="text-foreground">{note.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Note Info */}
              <div className="glass-card rounded-xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-foreground flex-1">{note.title}</h1>
                  <Badge>{note.fileType}</Badge>
                </div>

                <p className="text-muted-foreground mb-6">{note.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{note.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{note.uploadDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>
                      {note.branch} • Sem {note.semester} • {note.subject}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button className="gradient-primary flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant={liked ? "default" : "outline"}
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`}
                    />
                    {note.likes + (liked ? 1 : 0)}
                  </Button>
                  <Button
                    variant={saved ? "default" : "outline"}
                    onClick={() => setSaved(!saved)}
                  >
                    <Bookmark
                      className={`h-4 w-4 mr-2 ${saved ? "fill-current" : ""}`}
                    />
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>

              {/* PDF Viewer Placeholder */}
              <div className="glass-card rounded-xl p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Preview</h2>
                <div className="aspect-[3/4] bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      PDF preview will be displayed here
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="glass-card rounded-xl p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Comments ({comments.length})
                </h2>

                {/* Add Comment */}
                <form onSubmit={handleComment} className="mb-8">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-3"
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                        {c.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{c.user}</span>
                          <span className="text-sm text-muted-foreground">
                            {c.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{c.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Likes</span>
                    <span className="font-semibold text-foreground">{note.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Downloads
                    </span>
                    <span className="font-semibold text-foreground">{note.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Comments
                    </span>
                    <span className="font-semibold text-foreground">{comments.length}</span>
                  </div>
                </div>
              </div>

              {/* Related Notes */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Related Notes</h3>
                <div className="space-y-3">
                  <Link
                    to="/note/2"
                    className="block p-3 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      Advanced DSA Concepts
                    </h4>
                    <p className="text-xs text-muted-foreground">CSE • Sem 4</p>
                  </Link>
                  <Link
                    to="/note/3"
                    className="block p-3 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      DSA Previous Year Questions
                    </h4>
                    <p className="text-xs text-muted-foreground">CSE • Sem 3</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NoteDetail;
