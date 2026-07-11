import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { PageTransition } from "@/components/motion/PageTransition";
import { ParticleBackground } from "@/components/motion/ParticleBackground";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!" });
    navigate("/dashboard");
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: result.error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-subtle relative overflow-hidden">
      <ParticleBackground density={40} className="opacity-60" />
      <PageTransition>
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="p-2 rounded-lg glass">
              <BookOpen className="h-8 w-8 text-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">NotesHub</span>
          </Link>

          <div className="glass-intense rounded-2xl p-8 animate-fade-in hover-lift">
            <div className="text-center mb-8">
              <span className="eyebrow mb-4 justify-center">Sign In</span>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mt-3 mb-2 tracking-[-0.03em] leading-[1]">
                Welcome <span className="gradient-text italic font-light">back</span>
              </h1>
              <div className="rule-gold w-24 mx-auto my-3" />
              <p className="text-muted-foreground">Login to access your account</p>
            </div>

            <Button type="button" variant="outline" className="w-full mb-4" onClick={handleGoogle}>
              Continue with Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/40 px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@student.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-foreground font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Login;