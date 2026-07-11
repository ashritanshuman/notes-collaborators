import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/NoteCard";
import { ArrowRight, BookOpen, Users, TrendingUp, Shield, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/motion/PageTransition";
import { ParallaxSection } from "@/components/motion/ParallaxSection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Tilt3DCard } from "@/components/motion/Tilt3DCard";
import { ParticleBackground } from "@/components/motion/ParticleBackground";
import { FloatingNavDots } from "@/components/FloatingNavDots";
import { motion, useScroll, useTransform } from "framer-motion";

const Home = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const blob1Y = useTransform(scrollY, [0, 800], [0, -120]);
  const blob2Y = useTransform(scrollY, [0, 800], [0, 180]);
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
    <PageTransition>
    <div className="min-h-screen flex flex-col">
      <Header />
      <FloatingNavDots
        sections={[
          { id: "hero", label: "Home" },
          { id: "features", label: "Features" },
          { id: "top-notes", label: "Top Notes" },
          { id: "contributors", label: "Contributors" },
          { id: "cta", label: "Get Started" },
        ]}
      />

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden py-32 md:py-40 gradient-subtle scroll-mt-20">
        {/* Particle background */}
        <ParticleBackground />
        {/* Ambient background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: blob1Y }} className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></motion.div>
          <motion.div style={{ y: blob2Y }} className="absolute bottom-1/4 -right-1/4 w-[32rem] h-[32rem] bg-accent/5 rounded-full blur-3xl animate-float delay-200"></motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative pointer-events-none">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto text-center space-y-8">
            <div className="flex justify-center pointer-events-auto animate-fade-in">
              <span className="eyebrow">Vol. 01 &middot; The Study Journal</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-heading font-bold leading-[0.95] tracking-[-0.035em] animate-fade-in pointer-events-auto">
              <span className="text-foreground">Collaborative notes,</span>
              <span className="block mt-3 gradient-text italic font-light">
                elevated.
              </span>
            </h1>
            <div className="rule-gold w-40 mx-auto pointer-events-auto" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100 pointer-events-auto">
              Share, discover, and download quality study notes from students across all branches and semesters. Join the future of collaborative learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 animate-fade-in delay-200 pointer-events-auto">
              <Link to="/browse">
                <Button size="lg" className="gradient-primary group hover-glow text-base px-8 py-6 h-auto">
                  Browse Notes
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="glass text-base px-8 py-6 h-auto hover-lift border-accent/40">
                  Upload Notes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative scroll-mt-20">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="text-center mb-16">
            <span className="eyebrow mb-6">The Platform</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Why choose <span className="gradient-text italic font-light">NotesHub</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The best platform for collaborative learning and knowledge sharing
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <Tilt3DCard className="glass-card p-8 rounded-2xl text-center space-y-5 hover-glow transition-smooth group h-full">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Tilt3DCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Top Downloaded Notes */}
      <section id="top-notes" className="py-24 gradient-subtle scroll-mt-20">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="flex items-center justify-between mb-12">
            <div>
              <span className="eyebrow mb-4">This Week</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
                Most <span className="gradient-text italic font-light">downloaded</span>
              </h2>
              <p className="text-lg text-muted-foreground">Most popular study materials this week</p>
            </div>
            <Link to="/browse">
              <Button variant="ghost" className="hover-lift text-base text-accent hover:text-accent">
                View All
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topNotes.map((note, index) => (
              <RevealOnScroll key={note.id} delay={index * 0.12}>
                <Tilt3DCard intensity={8}>
                  <NoteCard {...note} />
                </Tilt3DCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section id="contributors" className="py-24 relative scroll-mt-20">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="text-center mb-16">
            <span className="eyebrow mb-6">Recognition</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Top <span className="gradient-text italic font-light">contributors</span>
            </h2>
            <p className="text-lg text-muted-foreground">Amazing students making learning better for everyone</p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {topContributors.map((contributor, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <Tilt3DCard className="glass-card p-8 rounded-2xl text-center space-y-6 hover-glow h-full">
                  <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-primary-foreground font-heading font-bold text-2xl hover:scale-110 transition-transform duration-300">
                    {contributor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">{contributor.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{contributor.uploads} uploads</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-foreground text-sm font-medium">
                    <Award className="h-4 w-4" />
                    {contributor.badge}
                  </div>
                </Tilt3DCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 gradient-subtle scroll-mt-20">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="glass-intense rounded-3xl p-16 text-center max-w-4xl mx-auto hover-lift relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <TrendingUp className="h-14 w-14 text-accent mx-auto mb-6 animate-float" />
              <span className="eyebrow mb-6 justify-center">Join Now</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                Ready to start <span className="gradient-text italic font-light">learning</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students sharing and accessing quality study materials. Upload your notes and help the community grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register">
                  <Button size="lg" className="gradient-primary hover-glow text-base px-8 py-6 h-auto">
                    Create Account
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button size="lg" variant="outline" className="glass text-base px-8 py-6 h-auto hover-lift">
                    Explore Notes
                  </Button>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
};

export default Home;
