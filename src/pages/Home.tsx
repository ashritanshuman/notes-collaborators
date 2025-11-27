import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/NoteCard";
import { ArrowRight, BookOpen, Users, TrendingUp, Shield, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  // Mock data for top notes
  const topNotes = [
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
      title: "Machine Learning Comprehensive Guide",
      subject: "Machine Learning",
      branch: "CSE",
      semester: "7",
      uploadedBy: "Priya Patel",
      uploadDate: "1 week ago",
      likes: 189,
      downloads: 423,
      fileType: "PDF",
    },
    {
      id: "3",
      title: "Digital Electronics Handwritten Notes",
      subject: "Digital Electronics",
      branch: "ECE",
      semester: "4",
      uploadedBy: "Amit Kumar",
      uploadDate: "3 days ago",
      likes: 156,
      downloads: 389,
      fileType: "PDF",
    },
  ];

  const topContributors = [
    { name: "Rahul Sharma", uploads: 45, badge: "Gold" },
    { name: "Priya Patel", uploads: 38, badge: "Gold" },
    { name: "Amit Kumar", uploads: 32, badge: "Silver" },
    { name: "Sneha Reddy", uploads: 28, badge: "Silver" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Vast Collection",
      description: "Access thousands of notes across all branches and semesters",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Students helping students with quality study materials",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All notes are reviewed and verified by our community",
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Quick search and instant download of any study material",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-background dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
              Collaborative Notes for
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Students
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share, discover, and download quality study notes from students across all branches and semesters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/browse">
                <Button size="lg" className="gradient-primary group">
                  Browse Notes
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline">
                  Upload Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose NotesHub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The best platform for collaborative learning and knowledge sharing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl text-center space-y-4 hover-lift"
              >
                <div className="inline-flex p-3 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Downloaded Notes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top Downloaded Notes</h2>
              <p className="text-muted-foreground">Most popular study materials this week</p>
            </div>
            <Link to="/browse">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topNotes.map((note) => (
              <NoteCard key={note.id} {...note} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Top Contributors</h2>
            <p className="text-muted-foreground">Amazing students making learning better for everyone</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {topContributors.map((contributor, index) => (
              <div key={index} className="glass-card p-6 rounded-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center text-white font-bold text-xl">
                  {contributor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{contributor.name}</h3>
                  <p className="text-sm text-muted-foreground">{contributor.uploads} uploads</p>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  <Award className="h-4 w-4" />
                  {contributor.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-2xl p-12 text-center max-w-4xl mx-auto">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students sharing and accessing quality study materials. Upload your notes and help the community grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gradient-primary">
                  Create Account
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline">
                  Explore Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
