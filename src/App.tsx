import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/motion/PageTransition";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BrowseNotes from "./pages/BrowseNotes";
import UploadNotes from "./pages/UploadNotes";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoteDetail from "./pages/NoteDetail";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const wrap = (node: React.ReactNode) => <PageTransition>{node}</PageTransition>;
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/browse" element={wrap(<BrowseNotes />)} />
        <Route path="/upload" element={wrap(<UploadNotes />)} />
        <Route path="/dashboard" element={wrap(<Dashboard />)} />
        <Route path="/admin" element={wrap(<AdminDashboard />)} />
        <Route path="/login" element={wrap(<Login />)} />
        <Route path="/register" element={wrap(<Register />)} />
        <Route path="/note/:id" element={wrap(<NoteDetail />)} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={wrap(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
