import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { PageTransition } from "@/components/motion/PageTransition";
import { ParticleBackground } from "@/components/motion/ParticleBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-subtle relative overflow-hidden">
      <ParticleBackground density={40} className="opacity-60" />
      <PageTransition>
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 rounded-lg glass">
            <BookOpen className="h-8 w-8 text-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-text">NotesHub</span>
        </Link>

        {/* Login Form */}
        <div className="glass-intense rounded-2xl p-8 animate-fade-in hover-lift">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">Login to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@student.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-foreground hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-foreground font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
      </PageTransition>
    </div>
  );
};

export default Login;
