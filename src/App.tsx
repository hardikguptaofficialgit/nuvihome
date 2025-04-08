
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { BlogProvider } from "./contexts/BlogContext";
import { ToolsProvider } from "./contexts/ToolsContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Resource from "./pages/Resource";
import Tools from "./pages/Tools";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import { ResourceProvider } from "./contexts/ResourceContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <BlogProvider>
          <ResourceProvider>
          <ToolsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Navbar />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/resource" element={<Resource />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </BrowserRouter>
            </TooltipProvider>
          </ToolsProvider>
          </ResourceProvider>
        </BlogProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
