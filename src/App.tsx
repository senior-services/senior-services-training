import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Auth } from "./pages/Auth";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { VideoPage } from "./pages/VideoPage";
import { NotFound } from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { useUserRole } from "./hooks/useUserRole";
import { VideoPlayerFullscreen } from "@/components/VideoPlayerFullscreen";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user);
  const navigate = useNavigate();
  
  const isAuthenticated = !!user;
  const loading = authLoading || (isAuthenticated && roleLoading);

  // Debug logging
  console.log('App Debug:', {
    user: user?.email,
    isAuthenticated,
    role,
    authLoading,
    roleLoading,
    loading,
    currentPath: window.location.pathname
  });

  const handleLogout = () => {
    signOut();
  };

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handlePlayVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsVideoOpen(true);
  };

  if (loading) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
            <div className="text-white text-lg">Loading...</div>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            !isAuthenticated ? 
              <Auth /> : 
              <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/auth" 
          element={
            !isAuthenticated ? 
              <Auth /> : 
              <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              role === 'admin' ? (
                <AdminDashboard 
                  userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  userEmail={user?.email || ''}
                  onLogout={handleLogout}
                />
              ) : (
                <EmployeeDashboard 
                  userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  userEmail={user?.email || ''}
                  onLogout={handleLogout}
                  onPlayVideo={handlePlayVideo}
                />
              )
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/video/:videoId" 
          element={<VideoPage />} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <VideoPlayerFullscreen
        open={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        videoId={selectedVideoId}
      />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;